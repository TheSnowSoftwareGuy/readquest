import { Link } from 'react-router-dom'

/**
 * Reusable child summary card for the Parent Dashboard.
 *
 * Props:
 *   child — { id, name, avatar, grade, school, streak, level, xp, xpForNext, xpInLevel, booksThisMonth, currentBook, currentBookCover }
 *   onSelect — callback when "View Details" is clicked
 */
export default function ChildOverviewCard({ child, onSelect }) {
  const pct = child.xpForNext ? Math.min((child.xpInLevel / child.xpForNext) * 100, 100) : 0

  return (
    <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm hover:shadow-md transition-shadow">
      {/* Header: avatar + name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-rq-purple to-rq-teal rounded-full flex items-center justify-center text-2xl shrink-0">
          {child.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-lg truncate">{child.name}</h3>
          <p className="text-xs text-rq-muted">{child.grade} · {child.school}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Streak */}
        <div className="text-center">
          <div className="text-xl font-bold text-rq-orange">
            🔥 {child.streak}
          </div>
          <div className="text-[10px] text-rq-muted">Day Streak</div>
        </div>

        {/* Level + XP */}
        <div className="text-center">
          <div className="text-xl font-bold text-rq-purple">
            ⚡ Lv {child.level}
          </div>
          <div className="text-[10px] text-rq-muted">{child.xp?.toLocaleString()} XP</div>
        </div>

        {/* Books this month */}
        <div className="text-center">
          <div className="text-xl font-bold text-rq-teal">
            📚 {child.booksThisMonth}
          </div>
          <div className="text-[10px] text-rq-muted">Books/Month</div>
        </div>
      </div>

      {/* Compact XP bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[10px] text-rq-muted mb-1">
          <span>Level {child.level}</span>
          <span>{Math.max(child.xpForNext - child.xpInLevel, 0)} XP to next</span>
        </div>
        <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="xp-bar h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Current book */}
      {child.currentBook && (
        <div className="flex items-center gap-3 bg-purple-50/50 rounded-xl p-3 mb-4">
          {child.currentBookCover ? (
            <img
              src={child.currentBookCover}
              alt={child.currentBook}
              className="w-10 h-14 rounded object-cover shadow-sm"
            />
          ) : (
            <div className="w-10 h-14 bg-gradient-to-br from-purple-200 to-teal-200 rounded flex items-center justify-center text-lg">
              📖
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-rq-muted uppercase font-semibold">Currently Reading</div>
            <div className="text-sm font-medium truncate">{child.currentBook}</div>
          </div>
        </div>
      )}

      {/* View Details link */}
      <button
        onClick={() => onSelect?.(child.id)}
        className="w-full text-center text-sm font-semibold text-rq-purple hover:text-rq-purple-dark transition-colors py-2 rounded-xl hover:bg-purple-50"
      >
        View Details →
      </button>
    </div>
  )
}
