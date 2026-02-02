// Supabase Edge Function: book-detail
// Get full book details from Open Library work key

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

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
    const key = url.searchParams.get('key');

    if (!key) {
      return new Response(
        JSON.stringify({ success: false, error: 'Open Library key required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const workKey = key.startsWith('/works/') ? key : `/works/${key}`;
    const response = await fetch(`${OPEN_LIBRARY_BASE}${workKey}.json`);

    if (response.status === 404) {
      return new Response(
        JSON.stringify({ success: false, error: 'Book not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
    if (!response.ok) throw new Error(`Open Library returned ${response.status}`);

    const data = await response.json();

    const description =
      typeof data.description === 'string'
        ? data.description
        : data.description?.value ?? null;

    const coverUrl = data.covers?.[0]
      ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
      : null;

    // Resolve authors
    const authorRefs = data.authors ?? [];
    const authors = await Promise.all(
      authorRefs.slice(0, 10).map(async (ref: { author?: { key: string } }) => {
        const authorKey = ref.author?.key;
        if (!authorKey) return null;
        try {
          const r = await fetch(`${OPEN_LIBRARY_BASE}${authorKey}.json`);
          if (r.ok) {
            const a = await r.json();
            return { name: a.name, key: authorKey };
          }
        } catch { /* ignore */ }
        return null;
      }),
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          key: data.key,
          title: data.title,
          description,
          coverUrl,
          authors: authors.filter(Boolean),
          subjects: data.subjects ?? [],
          subjectPlaces: data.subject_places ?? [],
          subjectTimes: data.subject_times ?? [],
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
