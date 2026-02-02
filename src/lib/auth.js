import { supabase } from './supabase.ts';

/**
 * Register a new teacher account.
 * Supabase Auth creates the auth.users row;
 * our DB trigger (handle_new_user) creates the profile.
 */
export async function registerTeacher({ email, password, username, displayName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: displayName,
        role: 'teacher',
      },
    },
  });
  if (error) throw error;
  return data;
}

/**
 * Create a student account (teacher action).
 * Uses the inviteUserByEmail approach or direct insert.
 * For MVP, teachers set the password directly via Edge Function.
 */
export async function createStudent({ email, password, username, displayName, classId }) {
  // This calls an Edge Function because we need service-role
  // to create a user on behalf of the teacher
  const { data: session } = await supabase.auth.getSession();
  const response = await supabase.functions.invoke('create-student', {
    body: { email, password, username, displayName, classId },
    headers: {
      Authorization: `Bearer ${session?.session?.access_token}`,
    },
  });
  if (response.error) throw response.error;
  return response.data;
}

/**
 * Login with email and password.
 */
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/**
 * Login with Google (SSO).
 */
export async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
  return data;
}

/**
 * Logout the current user.
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get the current authenticated user's profile.
 */
export async function getCurrentProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return { ...profile, email: user.email };
}

/**
 * Send a password reset email.
 */
export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset`,
  });
  if (error) throw error;
}

/**
 * Listen for auth state changes.
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}
