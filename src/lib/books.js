import { supabase } from './supabase.ts';

const OPEN_LIBRARY_BASE = 'https://openlibrary.org';

/**
 * Search books via Open Library API.
 * Runs client-side — no edge function needed for public API.
 */
export async function searchBooks({ query, title, author, isbn, page = 1, limit = 20 }) {
  const params = new URLSearchParams();

  if (query) params.set('q', query);
  if (title) params.set('title', title);
  if (author) params.set('author', author);
  if (isbn) params.set('isbn', isbn);

  params.set('limit', String(limit));
  params.set('offset', String((page - 1) * limit));
  params.set(
    'fields',
    'key,title,author_name,isbn,cover_i,first_publish_year,number_of_pages_median,subject,publisher'
  );

  const response = await fetch(`${OPEN_LIBRARY_BASE}/search.json?${params}`);
  if (!response.ok) throw new Error(`Open Library returned ${response.status}`);

  const data = await response.json();

  return {
    results: data.docs.map(mapDoc),
    total: data.numFound,
    page,
    limit,
  };
}

/**
 * Get a book by ISBN from Open Library, and cache it in our DB.
 */
export async function getBookByIsbn(isbn) {
  // Check our cache first
  const column = isbn.length === 13 ? 'isbn_13' : 'isbn_10';
  const { data: cached } = await supabase
    .from('books')
    .select('*')
    .eq(column, isbn)
    .maybeSingle();

  if (cached) return cached;

  // Fetch from Open Library
  const response = await fetch(`${OPEN_LIBRARY_BASE}/isbn/${isbn}.json`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Open Library returned ${response.status}`);

  const raw = await response.json();

  const coverUrl = raw.covers?.[0]
    ? `https://covers.openlibrary.org/b/id/${raw.covers[0]}-M.jpg`
    : `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;

  // Resolve author names
  const authorKeys = raw.authors?.map((a) => a.key) || [];
  const authorNames = await Promise.all(
    authorKeys.slice(0, 5).map(async (key) => {
      try {
        const r = await fetch(`${OPEN_LIBRARY_BASE}${key}.json`);
        if (r.ok) return (await r.json()).name || 'Unknown';
      } catch { /* ignore */ }
      return 'Unknown';
    })
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
    language: 'en',
  };

  // Cache in our Supabase DB
  const { data: saved, error } = await supabase
    .from('books')
    .upsert(bookRow, { onConflict: isbn.length === 13 ? 'isbn_13' : 'isbn_10' })
    .select()
    .single();

  if (error) {
    console.warn('Failed to cache book:', error);
    return bookRow; // Return uncached data
  }

  return saved;
}

/**
 * Get a book by its internal DB id.
 */
export async function getBookById(id) {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get detailed book info from Open Library work key.
 */
export async function getBookDetail(openLibraryKey) {
  const key = openLibraryKey.startsWith('/works/')
    ? openLibraryKey
    : `/works/${openLibraryKey}`;

  const response = await fetch(`${OPEN_LIBRARY_BASE}${key}.json`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Open Library returned ${response.status}`);

  const data = await response.json();
  const description =
    typeof data.description === 'string'
      ? data.description
      : data.description?.value ?? null;

  const coverUrl = data.covers?.[0]
    ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
    : null;

  return {
    key: data.key,
    title: data.title,
    description,
    coverUrl,
    subjects: data.subjects ?? [],
  };
}

// ── helpers ─────────────────────────────────────────
function mapDoc(doc) {
  const isbn = doc.isbn?.[0] ?? null;
  const coverId = doc.cover_i;
  return {
    title: doc.title,
    authors: doc.author_name ?? [],
    isbn,
    coverUrl:
      coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : isbn
          ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
          : null,
    openLibraryKey: doc.key,
    firstPublishYear: doc.first_publish_year ?? null,
    pageCount: doc.number_of_pages_median ?? null,
  };
}
