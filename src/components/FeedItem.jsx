import { useState } from 'react'

const REACTIONS = ['📚', '⭐', '🎉', '👏', '🔥']

// ─── Relative time helper ─────────────────────────────────────────────────────
function relativeTime(dateStr) {
  const now = new Date()
  const then = new Date(dateStr)
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay === 1) return 'yesterday'
  if (diffDay < 7) return `${diffDay}d ago`
  const diffWk = Math.floor(diffDay / 7)
  if (diffWk < 4) return `${diffWk}w ago`
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ─── Type-specific icons ──────────────────────────────────────────────────────
const TYPE_CONFIG = {
  book_complete: { icon: '📗', verb: 'finished reading', color: 'bg-green-100 text-green-700' },
  review: { icon: '✍️', verb: 'reviewed', color: 'bg-purple-100 text-rq-purple' },
  badge_earned: { icon: '🏅', verb: 'earned a badge', color: 'bg-yellow-100 text-yellow-700' },
  level_up: { icon: '⬆️', verb: 'leveled up', color: 'bg-blue-100 text-blue-700' },
  challenge_complete: { icon: '🏆', verb: 'completed a challenge', color: 'bg-teal-100 text-teal-700' },
  started_reading: { icon: '📖', verb: 'started reading', color: 'bg-orange-100 text-orange-700' },
}

export default function FeedItem({ item, onReact }) {
  const [myReactions, setMyReactions] = useState(item.myReactions || [])
  const [reactionCounts, setReactionCounts] = useState(item.reactionCounts || {})
  const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.book_complete

  function toggleReaction(emoji) {
    const has = myReactions.includes(emoji)
    const updated = has ? myReactions.filter((e) => e !== emoji) : [...myReactions, emoji]
    setMyReactions(updated)
    setReactionCounts((prev) => ({
      ...prev,
      [emoji]: Math.max(0, (prev[emoji] || 0) + (has ? -1 : 1)),
    }))
    onReact?.(item.id, emoji, !has)
  }

  const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0)

  return (
    <div className="bg-white rounded-2xl border border-purple-50 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-rq-purple to-rq-teal rounded-full flex items-center justify-center text-lg shrink-0">
            {item.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm">{item.userName}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.color}`}>
                {config.icon} {config.verb}
              </span>
            </div>
            <div className="text-xs text-rq-muted mt-0.5">{relativeTime(item.created_at)}</div>
          </div>
        </div>

        {/* Content body — different per type */}
        <div className="mt-3">
          {/* Book complete */}
          {item.type === 'book_complete' && (
            <div className="flex gap-3">
              {item.bookCover && (
                <img
                  src={item.bookCover}
                  alt={item.bookTitle}
                  className="w-14 h-20 object-cover rounded-lg shadow-sm shrink-0"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              )}
              <div>
                <p className="text-sm font-medium">{item.bookTitle}</p>
                {item.bookAuthor && <p className="text-xs text-rq-muted">by {item.bookAuthor}</p>}
                {item.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={`text-sm ${s <= item.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Review */}
          {item.type === 'review' && (
            <div className="flex gap-3">
              {item.bookCover && (
                <img
                  src={item.bookCover}
                  alt={item.bookTitle}
                  className="w-14 h-20 object-cover rounded-lg shadow-sm shrink-0"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              )}
              <div>
                <p className="text-sm font-medium">{item.bookTitle}</p>
                {item.rating && (
                  <div className="flex items-center gap-1 mt-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={`text-xs ${s <= item.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                )}
                {item.reviewText && (
                  <p className="text-sm text-rq-muted mt-1 line-clamp-3 italic">"{item.reviewText}"</p>
                )}
              </div>
            </div>
          )}

          {/* Badge earned */}
          {item.type === 'badge_earned' && (
            <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-3">
              <span className="text-3xl">{item.badgeIcon || '🏅'}</span>
              <div>
                <p className="font-semibold text-sm">{item.badgeName}</p>
                {item.badgeDescription && <p className="text-xs text-rq-muted">{item.badgeDescription}</p>}
              </div>
            </div>
          )}

          {/* Level up */}
          {item.type === 'level_up' && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-3 flex items-center gap-3">
              <span className="text-3xl">{item.levelEmoji || '⚡'}</span>
              <div>
                <p className="font-semibold text-sm">Level {item.newLevel}!</p>
                <p className="text-xs text-rq-muted">{item.levelTitle || 'New rank achieved'}</p>
                {item.totalXP && <p className="text-xs text-rq-purple font-bold mt-0.5">⚡ {item.totalXP.toLocaleString()} XP</p>}
              </div>
            </div>
          )}

          {/* Challenge complete */}
          {item.type === 'challenge_complete' && (
            <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-3 flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <p className="font-semibold text-sm">{item.challengeName}</p>
                {item.challengeDescription && <p className="text-xs text-rq-muted">{item.challengeDescription}</p>}
                {item.xpEarned && <p className="text-xs text-rq-purple font-bold mt-0.5">+{item.xpEarned} XP</p>}
              </div>
            </div>
          )}

          {/* Started reading */}
          {item.type === 'started_reading' && (
            <div className="flex gap-3">
              {item.bookCover && (
                <img
                  src={item.bookCover}
                  alt={item.bookTitle}
                  className="w-14 h-20 object-cover rounded-lg shadow-sm shrink-0"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              )}
              <div>
                <p className="text-sm font-medium">{item.bookTitle}</p>
                {item.bookAuthor && <p className="text-xs text-rq-muted">by {item.bookAuthor}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Reaction bar */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          {REACTIONS.map((emoji) => {
            const count = reactionCounts[emoji] || 0
            const active = myReactions.includes(emoji)
            return (
              <button
                key={emoji}
                onClick={() => toggleReaction(emoji)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-sm transition-all
                  ${active
                    ? 'bg-purple-100 border-purple-300 border shadow-sm scale-105'
                    : 'bg-gray-50 border border-gray-200 hover:bg-purple-50 hover:border-purple-200'
                  }`}
              >
                <span className="text-base">{emoji}</span>
                {count > 0 && <span className="text-xs font-semibold text-rq-muted">{count}</span>}
              </button>
            )
          })}
          {totalReactions > 0 && (
            <span className="text-xs text-rq-muted ml-1">{totalReactions} reactions</span>
          )}
        </div>
      </div>
    </div>
  )
}
