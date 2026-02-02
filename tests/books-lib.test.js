import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch for Open Library API tests
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock Supabase client
vi.mock('../src/lib/supabase.ts', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: { id: 'test-id', title: 'Test Book' },
            error: null,
          })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: { id: 'test-id', title: 'Test Book' },
            error: null,
          })),
        })),
      })),
    })),
  },
}));

// Must import after mocks
const { searchBooks, getBookDetail } = await import('../src/lib/books.js');

describe('Books Library', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('searchBooks', () => {
    it('should call Open Library search API with correct params', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          numFound: 1,
          docs: [
            {
              key: '/works/OL12345W',
              title: 'Harry Potter',
              author_name: ['J.K. Rowling'],
              isbn: ['9780439554930'],
              cover_i: 12345,
              first_publish_year: 1997,
              number_of_pages_median: 320,
            },
          ],
        }),
      });

      const result = await searchBooks({ query: 'Harry Potter', page: 1, limit: 10 });

      expect(mockFetch).toHaveBeenCalledOnce();
      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('openlibrary.org/search.json');
      expect(calledUrl).toContain('q=Harry+Potter');
      expect(calledUrl).toContain('limit=10');
      expect(calledUrl).toContain('offset=0');

      expect(result.total).toBe(1);
      expect(result.results).toHaveLength(1);
      expect(result.results[0].title).toBe('Harry Potter');
      expect(result.results[0].authors).toEqual(['J.K. Rowling']);
      expect(result.results[0].isbn).toBe('9780439554930');
      expect(result.results[0].coverUrl).toContain('covers.openlibrary.org');
    });

    it('should handle pagination correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ numFound: 100, docs: [] }),
      });

      await searchBooks({ query: 'test', page: 3, limit: 20 });

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('offset=40'); // (3-1) * 20
    });

    it('should throw on API error', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

      await expect(searchBooks({ query: 'test' })).rejects.toThrow('Open Library returned 500');
    });

    it('should handle missing cover gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          numFound: 1,
          docs: [{ key: '/works/OL1W', title: 'No Cover', isbn: ['1234567890'] }],
        }),
      });

      const result = await searchBooks({ query: 'no cover' });
      expect(result.results[0].coverUrl).toContain('isbn/1234567890');
    });

    it('should handle completely missing cover and isbn', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          numFound: 1,
          docs: [{ key: '/works/OL1W', title: 'Nothing' }],
        }),
      });

      const result = await searchBooks({ query: 'nothing' });
      expect(result.results[0].coverUrl).toBeNull();
    });
  });

  describe('getBookDetail', () => {
    it('should fetch work details from Open Library', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          key: '/works/OL82563W',
          title: 'Harry Potter and the Philosopher\'s Stone',
          description: 'A boy discovers he is a wizard.',
          covers: [8234567],
          subjects: ['Fantasy', 'Magic', 'Wizards'],
          authors: [],
        }),
      });

      const result = await getBookDetail('OL82563W');

      expect(result.title).toBe("Harry Potter and the Philosopher's Stone");
      expect(result.description).toBe('A boy discovers he is a wizard.');
      expect(result.coverUrl).toContain('8234567');
      expect(result.subjects).toContain('Fantasy');
    });

    it('should handle description object format', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          key: '/works/OL1W',
          title: 'Test',
          description: { type: '/type/text', value: 'A description object.' },
          authors: [],
        }),
      });

      const result = await getBookDetail('/works/OL1W');
      expect(result.description).toBe('A description object.');
    });

    it('should return null for 404', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

      const result = await getBookDetail('OL000W');
      expect(result).toBeNull();
    });

    it('should prepend /works/ if needed', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          key: '/works/OL1W', title: 'Test', authors: [],
        }),
      });

      await getBookDetail('OL1W');
      expect(mockFetch.mock.calls[0][0]).toContain('/works/OL1W.json');
    });
  });
});
