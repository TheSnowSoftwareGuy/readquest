import { useState, useEffect, useRef } from 'react'

export default function ReadingTimer({ books = [], onSessionComplete }) {
  const [selectedBookId, setSelectedBookId] = useState(books[0]?.id || '')
  const [status, setStatus] = useState('idle') // idle | running | paused
  const [elapsed, setElapsed] = useState(0) // seconds
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)
  const accumulatedRef = useRef(0)

  // Update selected book when books change
  useEffect(() => {
    if (books.length > 0 && !selectedBookId) {
      setSelectedBookId(books[0].id)
    }
  }, [books, selectedBookId])

  // Timer tick
  useEffect(() => {
    if (status === 'running') {
      startTimeRef.current = Date.now()
      intervalRef.current = setInterval(() => {
        const now = Date.now()
        const delta = Math.floor((now - startTimeRef.current) / 1000)
        setElapsed(accumulatedRef.current + delta)
      }, 250) // Update 4x/sec for smooth display
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [status])

  const handleStart = () => {
    if (!selectedBookId && books.length > 0) {
      setSelectedBookId(books[0].id)
    }
    accumulatedRef.current = elapsed
    setStatus('running')
  }

  const handlePause = () => {
    accumulatedRef.current = elapsed
    setStatus('paused')
  }

  const handleStop = () => {
    const minutes = Math.round(elapsed / 60)
    const selectedBook = books.find(b => b.id === selectedBookId)

    if (minutes > 0 && onSessionComplete) {
      onSessionComplete({
        bookId: selectedBookId,
        bookTitle: selectedBook?.title || 'Unknown Book',
        minutes,
        seconds: elapsed,
        date: new Date().toISOString().split('T')[0],
      })
    }

    setStatus('idle')
    setElapsed(0)
    accumulatedRef.current = 0
    startTimeRef.current = null
  }

  const handleReset = () => {
    setStatus('idle')
    setElapsed(0)
    accumulatedRef.current = 0
    startTimeRef.current = null
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const isRunning = status === 'running'
  const isPaused = status === 'paused'
  const isIdle = status === 'idle'

  return (
    <div className="bg-white rounded-2xl border border-purple-50 shadow-sm overflow-hidden">
      {/* Timer display */}
      <div className={`relative p-8 text-center transition-colors duration-500 ${
        isRunning
          ? 'bg-gradient-to-br from-purple-50 to-teal-50'
          : 'bg-white'
      }`}>
        {/* Animated pulse ring */}
        {isRunning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full border-4 border-rq-purple/20 animate-ping" style={{ animationDuration: '2s' }} />
          </div>
        )}

        {/* Book selector */}
        <div className="mb-4 relative z-10">
          <select
            value={selectedBookId}
            onChange={e => setSelectedBookId(e.target.value)}
            disabled={!isIdle}
            className="w-full max-w-xs mx-auto block text-sm bg-white/80 border border-purple-100 rounded-xl px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-rq-purple/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {books.length === 0 ? (
              <option value="">No books on shelf</option>
            ) : (
              books.map(b => (
                <option key={b.id} value={b.id}>
                  📖 {b.title}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Time display */}
        <div className="relative z-10 mb-6">
          <div className={`font-display text-6xl font-bold tracking-wider transition-colors ${
            isRunning ? 'text-rq-purple' : isPaused ? 'text-rq-orange' : 'text-rq-text'
          }`}>
            {formatTime(elapsed)}
          </div>
          <div className="text-sm text-rq-muted mt-1">
            {isRunning && '📖 Reading in progress...'}
            {isPaused && '⏸️ Paused'}
            {isIdle && elapsed === 0 && 'Ready to read?'}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 relative z-10">
          {isIdle && (
            <button
              onClick={handleStart}
              disabled={books.length === 0}
              className="px-8 py-3 bg-gradient-to-r from-rq-purple to-rq-teal text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              ▶ Start Reading
            </button>
          )}

          {isRunning && (
            <>
              <button
                onClick={handlePause}
                className="px-6 py-3 bg-rq-orange text-white rounded-full font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                ⏸ Pause
              </button>
              <button
                onClick={handleStop}
                className="px-6 py-3 bg-white text-rq-purple border-2 border-rq-purple rounded-full font-bold hover:bg-purple-50 transition-all"
              >
                ⏹ Stop & Save
              </button>
            </>
          )}

          {isPaused && (
            <>
              <button
                onClick={handleStart}
                className="px-6 py-3 bg-gradient-to-r from-rq-purple to-rq-teal text-white rounded-full font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                ▶ Resume
              </button>
              <button
                onClick={handleStop}
                className="px-6 py-3 bg-white text-rq-purple border-2 border-rq-purple rounded-full font-bold hover:bg-purple-50 transition-all"
              >
                ⏹ Stop & Save
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-3 text-rq-muted hover:text-red-500 transition-colors text-sm"
              >
                ✕ Discard
              </button>
            </>
          )}
        </div>
      </div>

      {/* Minutes summary */}
      {elapsed > 0 && (
        <div className="px-5 py-3 bg-purple-50/50 border-t border-purple-100 text-center">
          <span className="text-sm text-rq-muted">
            ⏱️ {Math.floor(elapsed / 60)} min {elapsed % 60}s logged
            {elapsed >= 60 && ' — Great job! 🎉'}
          </span>
        </div>
      )}
    </div>
  )
}
