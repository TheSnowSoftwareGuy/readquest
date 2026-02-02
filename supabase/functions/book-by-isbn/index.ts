// Supabase Edge Function: book-by-isbn
// Lookup a book by ISBN, cache it in our DB

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const OPEN_LIBRARY_BASE = 'https://openlibrary.org';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const isbn = url.searchParams.get('isbn');

    if (!isbn || isbn.length < 10) {
      return new Response(
        JSON.stringify({ success: false, error: 'Valid ISBN required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Init Supabase client with service role for DB writes
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Check cache
    const column = isbn.length === 13 ? 'isbn_13' : 'isbn_10';
    const { data: cached } = await supabase
      .from('books')
      .select('*')
      .eq(column, isbn)
      .maybeSingle();

    if (cached) {
      return new Response(
        JSON.stringify({ success: true, data: cached, cached: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Fetch from Open Library
    const olResponse = await fetch(`${OPEN_LIBRARY_BASE}/isbn/${isbn}.json`);
    if (olResponse.status === 404) {
      return new Response(
        JSON.stringify({ success: false, error: 'Book not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
    if (!olResponse.ok) throw new Error(`Open Library returned ${olResponse.status}`);

    const raw = await olResponse.json();

    const coverUrl = raw.covers?.[0]
      ? `https://covers.openlibrary.org/b/id/${raw.covers[0]}-M.jpg`
      : `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;

    // Resolve author names
    const authorKeys: string[] = raw.authors?.map((a: { key: string }) => a.key) || [];
    const authorNames = await Promise.all(
      authorKeys.slice(0, 5).map(async (key) => {
        try {
          const r = await fetch(`${OPEN_LIBRARY_BASE}${key}.json`);
          if (r.ok) return (await r.json()).name || 'Unknown';
        } catch { /* ignore */ }
        return 'Unknown';
      }),
    );

    const bookRow = {
      title: raw.title,
      authors: authorNames,
      isbn_10: isbn.length === 10 ? isbn : null,
      isbn_13: isbn.length === 13 ? isbn : null,
      open_library_key: raw.works?.[0]?.key || null,
      cover_url: coverUrl,
      cover_url_small: coverUrl.replace('-M.', '-S.'),
      cover_url_medium: coverUrl,
      page_count: raw.number_of_pages || null,
      description: null,
      language: 'en',
    };

    // Cache in DB
    const { data: saved, error } = await supabase
      .from('books')
      .insert(bookRow)
      .select()
      .single();

    return new Response(
      JSON.stringify({ success: true, data: saved || bookRow, cached: false }),
      {
        status: saved ? 201 : 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
