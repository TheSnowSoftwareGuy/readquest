// Supabase Edge Function: create-student
// Teachers create student accounts — requires service role
// because we're creating auth.users on behalf of someone else.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify the caller is an authenticated teacher
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // User-level client to verify caller identity
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user: caller }, error: authError } = await userClient.auth.getUser();
    if (authError || !caller) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Check caller is a teacher
    const { data: callerProfile } = await userClient
      .from('profiles')
      .select('role, school_id')
      .eq('id', caller.id)
      .single();

    if (!callerProfile || !['teacher', 'admin'].includes(callerProfile.role)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Only teachers can create student accounts' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Parse body
    const body = await req.json();
    const { email, password, username, displayName, classId, gradeLevel, dateOfBirth } = body;

    if (!username || !displayName || !password || !classId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: username, displayName, password, classId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Verify teacher owns the class
    const { data: classRecord } = await userClient
      .from('classes')
      .select('id, teacher_id, school_id')
      .eq('id', classId)
      .single();

    if (!classRecord || classRecord.teacher_id !== caller.id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Class not found or you are not the teacher' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Service role client to create the user
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Create the auth user
    const studentEmail = email || `${username}@students.readquest.app`;
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email: studentEmail,
      password,
      email_confirm: true, // Auto-confirm since teacher is creating
      user_metadata: {
        username,
        display_name: displayName,
        role: 'student',
      },
    });

    if (createError) {
      return new Response(
        JSON.stringify({ success: false, error: createError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Update profile with extra fields (trigger already created the base profile)
    if (newUser.user) {
      await adminClient
        .from('profiles')
        .update({
          school_id: classRecord.school_id,
          grade_level: gradeLevel || null,
          date_of_birth: dateOfBirth || null,
          status: 'pending_consent',
        })
        .eq('id', newUser.user.id);

      // Add to class
      await adminClient
        .from('class_memberships')
        .insert({
          class_id: classId,
          user_id: newUser.user.id,
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: newUser.user?.id,
          email: studentEmail,
          username,
          displayName,
          classId,
        },
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
