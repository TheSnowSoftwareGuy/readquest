import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase.ts'
import { sampleBooks, bookshelf as mockBookshelf, demoStudent, readingLog as mockReadingLog } from '../data/mockData'
import BookSearchModal from '../components/BookSearchModal'

const FALLBACK_COVER = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect fill="%236C3CE1" width="200" height="300" rx="8"/><text x="100" y="160" text-anchor="middle" fill="white" font-size="60">📖</text></svg>'

const SHELF_META = {
  reading: { label: '📖 Currently Reading', emoji: '📖', color: 'purple' },
  wantToRead: { label: '📋 Want to Read', emoji: '📋', color: 'teal' },
  finished: { label: '✅ Finished', emoji: '✅', color: 'green' },
}

// Generate demo data with progress information
function buildDemoShelves() {
  return {
    reading: mockBookshelf.reading.map((b, i) => ({
      ...b,
      shelfItemId: `si-r-${i}`,
      currentPage: Math.floor(b.pages * (0.3 + i * 0.35)),
      totalPages: b.pages,
    })),
    wantToRead: mockBookshelf.wantToRead.map((b, i) => ({
      ...b,
      shelfItemId: `si-w-${i}`,
      currentPage: 0,
      totalPages: b.pages,
    })),
    finished: mockBookshelf.finished.map((b, i) => ({
      ...b,
      shelfItemId: `si-f-${i}`,
      currentPage: b.pages,
      totalPages: b.pages,
    })),
  }
}

export default function MyBookshelf() {
  const [shelves, setShelves] = useState({ reading: [], wantToRead: [], finished: [] })
  const [activeShelf, setActiveShelf] = useState('reading')
  const [searchOpen, setSearchOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingProgress, setEditingProgress] = useState(null) // bookId
  const [moveDropdown, setMoveDropdown] = useState(null) // bookId

  // Load bookshelf data
  useEffect(() => {
    loadShelves()
  }, [])

  async function loadShelves() {
    setLoading(true)
    if (isSupabaseConfigured) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Fetch shelves for this user
          const { data: shelfData } = await supabase
            .from('bookshelves')
            .select(`
              id, name, shelf_type,
              shelf_items (
                id, position, current_page,
                books (id, title, authors, cover_url, cover_url_medium, page_count, isbn_13)
              )
            `)
            .eq('user_id', user.id)
            .order('created_at')

          if (shelfData && shelfData.length > 0) {
            const mapped = { reading: [], wantToRead: [], finished: [] }
            shelfData.forEach(shelf => {
              const key = shelf.shelf_type === 'currently_reading' ? 'reading'
                : shelf.shelf_type === 'want_to_read' ? 'wantToRead'
                : shelf.shelf_type === 'finished' ? 'finished' : null

              if (key && shelf.shelf_items) {
                mapped[key] = shelf.shelf_items.map(item => ({
                  id: item.books?.id,
                  shelfItemId: item.id,
                  shelfId: shelf.id,
                  title: item.books?.title || 'Unknown',
                  author: item.books?.authors?.[0] || 'Unknown Author',
                  cover: item.books?.cover_url_medium || item.books?.cover_url || FALLBACK_COVER,
                  pages: item.books?.page_count || 0,
                  currentPage: item.current_page || 0,
                  totalPages: item.books?.page_count || 0,
                  isbn: item.books?.isbn_13,
                }))
              }
            })
            setShelves(mapped)
            setLoading(false)
            return
          }
        }
      } catch (err) {
        console.warn('Failed to load shelves from Supabase, using demo data:', err)
      }
    }
    // Fallback to demo
    setShelves(buildDemoShelves())
    setLoading(false)
  }

  // Stats
  const totalBooks = shelves.finished.length
  const totalPages = shelves.finished.reduce((sum, b) => sum + (b.totalPages || 0), 0)
    + shelves.reading.reduce((sum, b) => sum + (b.currentPage || 0), 0)
  const currentStreak = demoStudent.currentStreak // Will come from Supabase later

  // Add book from search
  const handleAddBook = (book) => {
    const shelfKey = book.shelf || 'wantToRead'
    const newBook = {
      id: book.id || `local-${Date.now()}`,
      shelfItemId: `si-new-${Date.now()}`,
      title: book.title,
      author: book.author || book.authors?.[0] || 'Unknown',
      cover: book.cover || FALLBACK_COVER,
      pages: book.pages || 0,
      currentPage: shelfKey === 'finished' ? (book.pages || 0) : 0,
      totalPages: book.pages || 0,
    }

    setShelves(prev => ({
      ...prev,
      [shelfKey]: [...prev[shelfKey], newBook],
    }))

    // If Supabase is configured, persist
    if (isSupabaseConfigured) {
      persistAddBook(newBook, shelfKey)
    }
  }

  async function persistAddBook(book, shelfKey) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const shelfType = shelfKey === 'reading' ? 'currently_reading'
        : shelfKey === 'wantToRead' ? 'want_to_read' : 'finished'

      const { data: shelf } = await supabase
        .from('bookshelves')
        .select('id')
        .eq('user_id', user.id)
        .eq('shelf_type', shelfType)
        .single()

      if (shelf) {
        await supabase.from('shelf_items').insert({
          shelf_id: shelf.id,
          book_id: book.id,
          current_page: book.currentPage,
        })
      }
    } catch (err) {
      console.warn('Failed to persist book addition:', err)
    }
  }

  // Move book between shelves
  const handleMoveBook = (bookId, fromShelf, toShelf) => {
    if (fromShelf === toShelf) return
    setShelves(prev => {
      const book = prev[fromShelf].find(b => b.id === bookId)
      if (!book) return prev
      const updated = { ...prev }
      updated[fromShelf] = prev[fromShelf].filter(b => b.id !== bookId)
      // Update progress if moving to finished
      const movedBook = toShelf === 'finished'
        ? { ...book, currentPage: book.totalPages }
        : toShelf === 'wantToRead'
          ? { ...book, currentPage: 0 }
          : book
      updated[toShelf] = [...prev[toShelf], movedBook]
      return updated
    })
    setMoveDropdown(null)
  }

  // Update reading progress
  const handleProgressUpdate = (bookId, shelfKey, newPage) => {
    const page = Math.max(0, Math.min(parseInt(newPage) || 0, shelves[shelfKey].find(b => b.id === bookId)?.totalPages || 999))
    setShelves(prev => ({
      ...prev,
      [shelfKey]: prev[shelfKey].map(b =>
        b.id === bookId ? { ...b, currentPage: page } : b
      ),
    }))
  }

  // Remove book
  const handleRemoveBook = (bookId, shelfKey) => {
    setShelves(prev => ({
      ...prev,
      [shelfKey]: prev[shelfKey].filter(b => b.id !== bookId),
    }))
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="text-4xl animate-bounce-in mb-4">📚</div>
        <p className="text-rq-muted">Loading your bookshelf...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">My Bookshelf 📚</h1>
          <p className="text-rq-muted">Track your reading journey — add books, log progress, level up!</p>
        </div>
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rq-purple to-rq-purple-light text-white rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 transition-all"
        >
          <span>➕</span> Add Book
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-4 border border-purple-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xl">📚</span>
          </div>
          <div className="font-display text-2xl font-bold">{totalBooks}</div>
          <div className="text-xs text-rq-muted">Books Finished</div>
        </div>
        <div className="bg-gradient-to-br from-teal-100 to-teal-50 rounded-2xl p-4 border border-teal-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xl">📄</span>
          </div>
          <div className="font-display text-2xl font-bold">{totalPages.toLocaleString()}</div>
          <div className="text-xs text-rq-muted">Pages Read</div>
        </div>
        <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-4 border border-orange-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xl">🔥</span>
          </div>
          <div className="font-display text-2xl font-bold">{currentStreak}</div>
          <div className="text-xs text-rq-muted">Day Streak</div>
        </div>
      </div>

      {/* Shelf tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.entries(SHELF_META).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => setActiveShelf(key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeShelf === key
                ? 'bg-gradient-to-r from-rq-purple to-rq-purple-light text-white shadow-md'
                : 'bg-white text-rq-muted border border-purple-100 hover:border-rq-purple/30'
            }`}
          >
            {meta.label} ({shelves[key].length})
          </button>
        ))}
      </div>

      {/* Books grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {shelves[activeShelf].map((book) => {
          const progress = book.totalPages > 0
            ? Math.round((book.currentPage / book.totalPages) * 100)
            : 0

          return (
            <div
              key={book.id}
              className="bg-white rounded-xl border border-purple-50 overflow-hidden hover:shadow-lg transition-all group relative"
            >
              {/* Cover */}
              <Link to={`/book/${book.id}`}>
                <div className="aspect-[2/3] bg-gradient-to-br from-purple-100 to-teal-100 overflow-hidden cursor-pointer">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={e => { e.target.src = FALLBACK_COVER }}
                  />
                </div>
              </Link>

              {/* Info */}
              <div className="p-3">
                <Link to={`/book/${book.id}`}>
                  <div className="font-semibold text-sm truncate hover:text-rq-purple transition-colors">{book.title}</div>
                </Link>
                <div className="text-xs text-rq-muted truncate mb-2">{book.author}</div>

                {/* Progress bar (for reading / finished) */}
                {activeShelf !== 'wantToRead' && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-[10px] text-rq-muted mb-1">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-rq-purple to-rq-teal h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Progress editor (for currently reading) */}
                {activeShelf === 'reading' && (
                  <div className="mb-2">
                    {editingProgress === book.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max={book.totalPages}
                          value={book.currentPage}
                          onChange={e => handleProgressUpdate(book.id, activeShelf, e.target.value)}
                          className="w-16 text-xs border border-purple-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-rq-purple"
                          autoFocus
                        />
                        <span className="text-[10px] text-rq-muted">/ {book.totalPages} pg</span>
                        <button
                          onClick={() => setEditingProgress(null)}
                          className="text-xs text-rq-purple font-semibold ml-auto"
                        >
                          ✓
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingProgress(book.id)}
                        className="text-[10px] text-rq-purple hover:underline font-medium"
                      >
                        📝 Update page ({book.currentPage}/{book.totalPages})
                      </button>
                    )}
                  </div>
                )}

                {/* Actions row */}
                <div className="flex items-center gap-1 relative">
                  {/* Move button */}
                  <button
                    onClick={() => setMoveDropdown(moveDropdown === book.id ? null : book.id)}
                    className="text-[10px] px-2 py-1 rounded-lg bg-gray-50 text-rq-muted hover:bg-purple-50 hover:text-rq-purple transition-colors"
                  >
                    📂 Move
                  </button>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemoveBook(book.id, activeShelf)}
                    className="text-[10px] px-2 py-1 rounded-lg bg-gray-50 text-rq-muted hover:bg-red-50 hover:text-red-500 transition-colors ml-auto"
                  >
                    🗑️
                  </button>

                  {/* Move dropdown */}
                  {moveDropdown === book.id && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-purple-100 rounded-xl shadow-lg z-20 py-1 min-w-[160px]">
                      {Object.entries(SHELF_META)
                        .filter(([key]) => key !== activeShelf)
                        .map(([key, meta]) => (
                          <button
                            key={key}
                            onClick={() => handleMoveBook(book.id, activeShelf, key)}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-purple-50 transition-colors"
                          >
                            {meta.emoji} Move to {meta.label.replace(/^[^\s]+ /, '')}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Add Book Card */}
        <div
          onClick={() => setSearchOpen(true)}
          className="bg-white rounded-xl border-2 border-dashed border-purple-200 flex flex-col items-center justify-center min-h-[320px] hover:border-rq-purple hover:bg-purple-50/50 transition-all cursor-pointer group"
        >
          <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">➕</span>
          <span className="text-sm font-semibold text-rq-purple">Add Book</span>
          <span className="text-xs text-rq-muted">Search or scan</span>
        </div>
      </div>

      {/* Empty state */}
      {shelves[activeShelf].length === 0 && (
        <div className="text-center py-12">
          <span className="text-5xl block mb-3">{SHELF_META[activeShelf].emoji}</span>
          <h3 className="font-display font-semibold text-lg mb-1">
            No books in {SHELF_META[activeShelf].label.replace(/^[^\s]+ /, '')} yet
          </h3>
          <p className="text-sm text-rq-muted mb-4">Search for a book to add it to your shelf!</p>
          <button
            onClick={() => setSearchOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-rq-purple to-rq-purple-light text-white rounded-full font-semibold text-sm hover:shadow-lg transition-all"
          >
            ➕ Add Your First Book
          </button>
        </div>
      )}

      {/* Close dropdown on outside click */}
      {moveDropdown && (
        <div className="fixed inset-0 z-10" onClick={() => setMoveDropdown(null)} />
      )}

      {/* Search Modal */}
      <BookSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onAddBook={handleAddBook}
        targetShelf={activeShelf}
      />
    </div>
  )
}
