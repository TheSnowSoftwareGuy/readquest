import { useState, useEffect, useRef, useCallback } from 'react'
import { searchBooks } from '../lib/books'
import { isSupabaseConfigured } from '../lib/supabase.ts'
import { sampleBooks } from '../data/mockData'

const FALLBACK_COVER = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect fill="%236C3CE1" width="200" height="300" rx="8"/><text x="100" y="160" text-anchor="middle" fill="white" font-size="60">📖</text></svg>'

export default function BookSearchModal({ isOpen, onClose, onAddBook, targetShelf = 'reading' }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedShelf, setSelectedShelf] = useState(targetShelf)
  const [addedIds, setAddedIds] = useState(new Set())
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
    if (!isOpen) {
      setQuery('')
      setResults([])
      setError(null)
      setAddedIds(new Set())
    }
  }, [isOpen])

  // Debounced search
  const doSearch = useCallback(async (q) => {
    if (!q || q.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Try live Open Library search
      const { results: searchResults } = await searchBooks({ query: q, limit: 12 })
      setResults(searchResults.map((r, i) => ({
        id: r.openLibraryKey || `ol-${i}`,
        title: r.title,
        author: r.authors?.[0] || 'Unknown Author',
        authors: r.authors || [],
        cover: r.coverUrl || FALLBACK_COVER,
        pages: r.pageCount || null,
        isbn: r.isbn || null,
        year: r.firstPublishYear || null,
        openLibraryKey: r.openLibraryKey,
      })))
    } catch (err) {
      console.warn('Search failed, falling back to mock data:', err.message)
      // Fallback to mock data filtered by query
      const q_lower = q.toLowerCase()
      const filtered = sampleBooks.filter(b =>
        b.title.toLowerCase().includes(q_lower) ||
        b.author.toLowerCase().includes(q_lower)
      )
      setResults(filtered.map(b => ({
        id: b.id,
        title: b.title,
        author: b.author,
        authors: [b.author],
        cover: b.cover || FALLBACK_COVER,
        pages: b.pages || null,
        isbn: null,
        year: null,
      })))
      if (filtered.length === 0) {
        setError('No results found. Try a different search term.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(query), 400)
    return () => clearTimeout(debounceRef.current)
  }, [query, doSearch])

  const handleAdd = (book) => {
    onAddBook({ ...book, shelf: selectedShelf })
    setAddedIds(prev => new Set([...prev, book.id]))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-rq-text">📚 Add a Book</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Search input */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-purple-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rq-purple/30 focus:border-rq-purple transition-all"
            />
            {loading && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm animate-spin">⏳</span>
            )}
          </div>

          {/* Shelf selector */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-rq-muted">Add to:</span>
            {[
              { key: 'reading', label: '📖 Currently Reading' },
              { key: 'wantToRead', label: '📋 Want to Read' },
              { key: 'finished', label: '✅ Finished' },
            ].map(s => (
              <button
                key={s.key}
                onClick={() => setSelectedShelf(s.key)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  selectedShelf === s.key
                    ? 'bg-gradient-to-r from-rq-purple to-rq-purple-light text-white shadow-sm'
                    : 'bg-gray-100 text-rq-muted hover:bg-purple-50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-5">
          {!query && (
            <div className="text-center py-12 text-rq-muted">
              <span className="text-4xl block mb-3">🔍</span>
              <p className="text-sm">Search for a book by title or author</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-rq-muted">
              <span className="text-3xl block mb-2">📭</span>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {query && !loading && results.length === 0 && !error && query.length >= 2 && (
            <div className="text-center py-8 text-rq-muted">
              <span className="text-3xl block mb-2">🤔</span>
              <p className="text-sm">No books found for "{query}"</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          )}

          <div className="space-y-2">
            {results.map((book) => {
              const isAdded = addedIds.has(book.id)
              return (
                <div
                  key={book.id}
                  className="flex gap-3 items-center p-3 rounded-xl hover:bg-purple-50/50 transition-colors group"
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded-lg shadow-sm flex-shrink-0"
                    onError={e => { e.target.src = FALLBACK_COVER }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{book.title}</div>
                    <div className="text-xs text-rq-muted truncate">
                      {book.author}
                      {book.year && <span> · {book.year}</span>}
                    </div>
                    {book.pages && (
                      <div className="text-xs text-rq-muted mt-0.5">{book.pages} pages</div>
                    )}
                  </div>
                  <button
                    onClick={() => handleAdd(book)}
                    disabled={isAdded}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isAdded
                        ? 'bg-green-100 text-green-600 cursor-default'
                        : 'bg-gradient-to-r from-rq-purple to-rq-purple-light text-white hover:shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    {isAdded ? '✓ Added' : '+ Add'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
