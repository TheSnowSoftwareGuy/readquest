import { useState, useEffect, useMemo } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.ts'
import { readingLog as mockReadingLog, bookshelf as mockBookshelf, demoStudent, sampleBooks } from '../data/mockData'
import ReadingTimer from '../components/ReadingTimer'
import CalendarHeatmap from '../components/CalendarHeatmap'

export default function ReadingLog() {
  const [sessions, setSessions] = useState([])
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [manualFormOpen, setManualFormOpen] = useState(false)
  const [manualEntry, setManualEntry] = useState({ bookId: '', minutes: '', pages: '' })
  const [viewMode, setViewMode] = useState('week') // week | month

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)

    if (isSupabaseConfigured) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Fetch reading logs
          const { data: logs } = await supabase
            .from('reading_logs')
            .select('*, books(id, title, authors, cover_url)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(100)

          if (logs) {
            setSessions(logs.map(l => ({
              id: l.id,
              date: l.created_at?.split('T')[0],
              minutes: l.minutes_read,
              pages: l.pages_read || 0,
              book: l.books?.title || 'Unknown',
              bookId: l.book_id,
            })))
          }

          // Fetch currently reading books
          const { data: shelfData } = await supabase
            .from('bookshelves')
            .select(`id, shelf_items(id, books(id, title, authors, cover_url))`)
            .eq('user_id', user.id)
            .eq('shelf_type', 'currently_reading')
            .single()

          if (shelfData?.shelf_items) {
            setBooks(shelfData.shelf_items.map(si => ({
              id: si.books?.id,
              title: si.books?.title || 'Unknown',
            })))
          }

          setLoading(false)
          return
        }
      } catch (err) {
        console.warn('Failed to load reading log from Supabase:', err)
      }
    }

    // Fallback: build demo data with more days for a good heatmap
    const demoSessions = buildDemoSessions()
    setSessions(demoSessions)
    setBooks([
      ...mockBookshelf.reading.map(b => ({ id: b.id, title: b.title })),
      ...mockBookshelf.finished.slice(0, 2).map(b => ({ id: b.id, title: b.title })),
    ])
    setLoading(false)
  }

  // Handle timer completion
  const handleTimerComplete = (session) => {
    const newSession = {
      id: `session-${Date.now()}`,
      date: session.date,
      minutes: session.minutes,
      pages: 0,
      book: session.bookTitle,
      bookId: session.bookId,
    }
    setSessions(prev => [newSession, ...prev])

    // Persist to Supabase if configured
    if (isSupabaseConfigured) {
      persistSession(newSession)
    }
  }

  // Handle manual entry
  const handleManualSubmit = (e) => {
    e.preventDefault()
    const book = books.find(b => b.id === manualEntry.bookId)
    const newSession = {
      id: `session-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      minutes: parseInt(manualEntry.minutes) || 0,
      pages: parseInt(manualEntry.pages) || 0,
      book: book?.title || 'Unknown Book',
      bookId: manualEntry.bookId,
    }

    if (newSession.minutes > 0) {
      setSessions(prev => [newSession, ...prev])
      if (isSupabaseConfigured) {
        persistSession(newSession)
      }
    }

    setManualEntry({ bookId: '', minutes: '', pages: '' })
    setManualFormOpen(false)
  }

  async function persistSession(session) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('reading_logs').insert({
        user_id: user.id,
        book_id: session.bookId || null,
        minutes_read: session.minutes,
        pages_read: session.pages || 0,
      })
    } catch (err) {
      console.warn('Failed to persist reading session:', err)
    }
  }

  // Stats computations
  const stats = useMemo(() => {
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(today.getDate() - 7)
    const monthAgo = new Date(today)
    monthAgo.setDate(today.getDate() - 30)

    const weekSessions = sessions.filter(s => new Date(s.date) >= weekAgo)
    const monthSessions = sessions.filter(s => new Date(s.date) >= monthAgo)

    const weekMinutes = weekSessions.reduce((sum, s) => sum + s.minutes, 0)
    const weekPages = weekSessions.reduce((sum, s) => sum + s.pages, 0)
    const monthMinutes = monthSessions.reduce((sum, s) => sum + s.minutes, 0)
    const monthPages = monthSessions.reduce((sum, s) => sum + s.pages, 0)
    const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0)

    // Streak calculation
    const dateSet = new Set(sessions.map(s => s.date))
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    const d = new Date(today)

    // Current streak — count back from today
    for (let i = 0; i < 365; i++) {
      const dateStr = d.toISOString().split('T')[0]
      if (dateSet.has(dateStr)) {
        currentStreak++
        d.setDate(d.getDate() - 1)
      } else {
        break
      }
    }

    // Longest streak — scan all dates
    const allDates = [...dateSet].sort()
    allDates.forEach((dateStr, i) => {
      if (i === 0) {
        tempStreak = 1
      } else {
        const prev = new Date(allDates[i - 1])
        const curr = new Date(dateStr)
        const diff = (curr - prev) / (1000 * 60 * 60 * 24)
        tempStreak = diff === 1 ? tempStreak + 1 : 1
      }
      longestStreak = Math.max(longestStreak, tempStreak)
    })

    return {
      weekMinutes,
      weekPages,
      monthMinutes,
      monthPages,
      totalMinutes,
      currentStreak: currentStreak || demoStudent.currentStreak,
      longestStreak: Math.max(longestStreak, demoStudent.longestStreak),
      weekSessions: weekSessions.length,
      monthSessions: monthSessions.length,
    }
  }, [sessions])

  // Heatmap data
  const heatmapData = useMemo(() => {
    const map = {}
    sessions.forEach(s => {
      map[s.date] = (map[s.date] || 0) + s.minutes
    })
    return Object.entries(map).map(([date, minutes]) => ({ date, minutes }))
  }, [sessions])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="text-4xl animate-bounce-in mb-4">📖</div>
        <p className="text-rq-muted">Loading your reading log...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Reading Log 📖</h1>
          <p className="text-rq-muted">Track your reading sessions, build streaks, and watch your progress grow!</p>
        </div>
        <button
          onClick={() => setManualFormOpen(!manualFormOpen)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-purple-200 text-rq-purple rounded-full font-semibold text-sm hover:bg-purple-50 transition-all"
        >
          <span>✏️</span> Log Manually
        </button>
      </div>

      {/* Streak & Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-4 border border-orange-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🔥</span>
            <span className="text-[10px] bg-white/70 rounded-full px-2 py-0.5 text-rq-muted font-medium">Current</span>
          </div>
          <div className="font-display text-3xl font-bold">{stats.currentStreak}</div>
          <div className="text-xs text-rq-muted">Day Streak</div>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-4 border border-purple-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🏆</span>
            <span className="text-[10px] bg-white/70 rounded-full px-2 py-0.5 text-rq-muted font-medium">Best</span>
          </div>
          <div className="font-display text-3xl font-bold">{stats.longestStreak}</div>
          <div className="text-xs text-rq-muted">Longest Streak</div>
        </div>
        <div className="bg-gradient-to-br from-teal-100 to-teal-50 rounded-2xl p-4 border border-teal-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">⏱️</span>
          </div>
          <div className="font-display text-3xl font-bold">{stats.totalMinutes.toLocaleString()}</div>
          <div className="text-xs text-rq-muted">Total Minutes</div>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📅</span>
          </div>
          <div className="font-display text-3xl font-bold">{sessions.length}</div>
          <div className="text-xs text-rq-muted">Sessions Logged</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Reading Timer */}
        <div>
          <h2 className="font-display font-semibold text-lg mb-3">⏱️ Reading Timer</h2>
          <ReadingTimer books={books} onSessionComplete={handleTimerComplete} />
        </div>

        {/* Manual Entry Form */}
        <div>
          <h2 className="font-display font-semibold text-lg mb-3">✏️ Quick Log</h2>
          <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              {/* Book select */}
              <div>
                <label className="block text-sm text-rq-muted mb-1">Book</label>
                <select
                  value={manualEntry.bookId}
                  onChange={e => setManualEntry(prev => ({ ...prev, bookId: e.target.value }))}
                  className="w-full bg-gray-50 border border-purple-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rq-purple/30"
                  required
                >
                  <option value="">Select a book...</option>
                  {books.map(b => (
                    <option key={b.id} value={b.id}>📖 {b.title}</option>
                  ))}
                </select>
              </div>

              {/* Minutes & Pages */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-rq-muted mb-1">Minutes</label>
                  <input
                    type="number"
                    min="1"
                    max="480"
                    value={manualEntry.minutes}
                    onChange={e => setManualEntry(prev => ({ ...prev, minutes: e.target.value }))}
                    placeholder="30"
                    className="w-full bg-gray-50 border border-purple-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rq-purple/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-rq-muted mb-1">Pages Read</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={manualEntry.pages}
                    onChange={e => setManualEntry(prev => ({ ...prev, pages: e.target.value }))}
                    placeholder="25"
                    className="w-full bg-gray-50 border border-purple-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rq-purple/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-rq-purple to-rq-teal text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-200 transition-all"
              >
                📝 Log Reading Session
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Calendar Heatmap */}
      <div className="mb-6">
        <CalendarHeatmap data={heatmapData} />
      </div>

      {/* Weekly / Monthly Summary */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg">📊 Weekly Summary</h3>
            <span className="text-xs bg-purple-100 text-rq-purple px-2 py-1 rounded-full font-medium">Last 7 days</span>
          </div>
          <div className="space-y-3">
            <SummaryRow icon="⏱️" label="Minutes Read" value={`${stats.weekMinutes} min`} />
            <SummaryRow icon="📄" label="Pages Read" value={`${stats.weekPages} pages`} />
            <SummaryRow icon="📝" label="Sessions" value={`${stats.weekSessions} sessions`} />
            <SummaryRow icon="📈" label="Avg per Day" value={`${Math.round(stats.weekMinutes / 7)} min/day`} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg">📊 Monthly Summary</h3>
            <span className="text-xs bg-teal-100 text-rq-teal px-2 py-1 rounded-full font-medium">Last 30 days</span>
          </div>
          <div className="space-y-3">
            <SummaryRow icon="⏱️" label="Minutes Read" value={`${stats.monthMinutes} min`} />
            <SummaryRow icon="📄" label="Pages Read" value={`${stats.monthPages} pages`} />
            <SummaryRow icon="📝" label="Sessions" value={`${stats.monthSessions} sessions`} />
            <SummaryRow icon="📈" label="Avg per Day" value={`${Math.round(stats.monthMinutes / 30)} min/day`} />
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-2xl border border-purple-50 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-purple-50">
          <h3 className="font-display font-semibold text-lg">📋 Recent Sessions</h3>
        </div>
        <div className="divide-y divide-purple-50">
          {sessions.slice(0, 15).map((session) => (
            <div key={session.id} className="flex items-center gap-4 px-5 py-3 hover:bg-purple-50/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center text-lg flex-shrink-0">
                📖
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{session.book}</div>
                <div className="text-xs text-rq-muted">{formatSessionDate(session.date)}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-sm text-rq-purple">{session.minutes} min</div>
                {session.pages > 0 && (
                  <div className="text-xs text-rq-muted">{session.pages} pages</div>
                )}
              </div>
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="p-8 text-center text-rq-muted">
              <span className="text-3xl block mb-2">📭</span>
              <p className="text-sm">No reading sessions yet. Start the timer or log manually!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Helper components ───────────────────────────── */

function SummaryRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-sm text-rq-muted">{label}</span>
      </div>
      <span className="font-bold text-sm">{value}</span>
    </div>
  )
}

function formatSessionDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  const today = new Date()
  const diff = Math.floor((today - d) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/* ── Demo data builder ───────────────────────────── */

function buildDemoSessions() {
  // Build ~60 days of reading data for a nice heatmap
  const sessions = []
  const books = ['Percy Jackson & The Lightning Thief', 'Wings of Fire: The Dragonet Prophecy', 'Holes', 'Wonder', 'Harry Potter and the Sorcerer\'s Stone', 'The Wild Robot']
  const today = new Date()

  for (let i = 0; i < 70; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]

    // Skip some days randomly for realistic data
    if (Math.random() < 0.2) continue

    const minutes = 15 + Math.floor(Math.random() * 40)
    const pages = Math.floor(minutes * 1.2)
    const book = books[Math.floor(Math.random() * books.length)]

    sessions.push({
      id: `demo-${i}`,
      date: dateStr,
      minutes,
      pages,
      book,
      bookId: `book-${i % books.length}`,
    })
  }

  // Also include the original mock data
  mockReadingLog.forEach((entry, i) => {
    if (!sessions.find(s => s.date === entry.date)) {
      sessions.push({
        id: `mock-${i}`,
        date: entry.date,
        minutes: entry.minutes,
        pages: entry.pages,
        book: entry.book,
        bookId: `mock-book-${i}`,
      })
    }
  })

  return sessions.sort((a, b) => b.date.localeCompare(a.date))
}
