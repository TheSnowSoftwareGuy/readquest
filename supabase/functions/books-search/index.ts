// Supabase Edge Function: books-search
// Search Open Library and return normalized results
// Runs server-side to allow caching & rate control

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const OPEN_LIBRARY_BASE = 'https://openlibrary.org';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchParams {
  q?: string;
  title?: string;
  author?: string;
  isbn?: string;
  page?: number;
  limit?: number;
}

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const params: SearchParams = {
      q: url.searchParams.get('q') || undefined,
      title: url.searchParams.get('title') || undefined,
      author: url.searchParams.get('author') || undefined,
      isbn: url.searchParams.get('isbn') || undefined,
      page: parseInt(url.searchParams.get('page') || '1'),
      limit: Math.min(parseInt(url.searchParams.get('limit') || '20'), 100),
    };

    if (!params.q && !params.title && !params.author && !params.isbn) {
      return new Response(
        JSON.stringify({ success: false, error: 'At least one search parameter required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set('q', params.q);
    if (params.title) searchParams.set('title', params.title);
    if (params.author) searchParams.set('author', params.author);
    if (params.isbn) searchParams.set('isbn', params.isbn);
    searchParams.set('limit', String(params.limit));
    searchParams.set('offset', String(((params.page || 1) - 1) * (params.limit || 20)));
    searchParams.set('fields', 'key,title,author_name,isbn,cover_i,first_publish_year,number_of_pages_median,subject,publisher');

    const olResponse = await fetch(`${OPEN_LIBRARY_BASE}/search.json?${searchParams}`);
    if (!olResponse.ok) {
      throw new Error(`Open Library returned ${olResponse.status}`);
    }

    const data = await olResponse.json();

    const results = data.docs.map((doc: Record<string, unknown>) => {
      const isbn = (doc.isbn as string[])?.[0] ?? null;
      const coverId = doc.cover_i as number | undefined;
      return {
        title: doc.title,
        authors: (doc.author_name as string[]) ?? [],
        isbn,
        coverUrl:
          coverId
            ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
            : isbn
              ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
              : null,
        openLibraryKey: doc.key,
        firstPublishYear: (doc.first_publish_year as number) ?? null,
        pageCount: (doc.number_of_pages_median as number) ?? null,
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: results,
        meta: {
          total: data.numFound,
          page: params.page,
          limit: params.limit,
          totalPages: Math.ceil(data.numFound / (params.limit || 20)),
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
