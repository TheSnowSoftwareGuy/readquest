import { useState } from 'react'

const RARITY_STYLES = {
  common:    { border: 'border-gray-300',   glow: 'shadow-gray-200',   bg: 'bg-gray-50',     text: 'text-gray-500',   label: 'Common' },
  rare:      { border: 'border-blue-400',   glow: 'shadow-blue-200',   bg: 'bg-blue-50',     text: 'text-blue-500',   label: 'Rare' },
  epic:      { border: 'border-purple-500', glow: 'shadow-purple-300', bg: 'bg-purple-50',   text: 'text-purple-600', label: 'Epic' },
  legendary: { border: 'border-yellow-400', glow: 'shadow-yellow-300', bg: 'bg-yellow-50',   text: 'text-yellow-600', label: 'Legendary' },
}

const CATEGORY_ICONS = {
  reading: '📖', streak: '🔥', review: '✍️', genre: '🗺️', social: '👥', special: '⭐',
}

/**
 * Reusable badge display card.
 *
 * Props:
 *   badge    — { name, description, icon, rarity, category, xpReward }
 *   earned   — boolean
 *   earnDate — ISO date string (optional)
 *   onClick  — click handler (opens modal in parent)
 */
export default function BadgeCard({ badge, earned = false, earnDate, onClick }) {
  const rarity = RARITY_STYLES[badge.rarity] || RARITY_STYLES.common
  const icon = badge.icon || CATEGORY_ICONS[badge.category] || '🏅'

  return (
    <button
      onClick={() => onClick?.(badge)}
      className={`
        relative flex flex-col items-center text-center p-3 rounded-2xl border-2 transition-all duration-300 cursor-pointer
        ${earned
          ? `${rarity.border} ${rarity.bg} hover:shadow-lg ${rarity.glow} hover:-translate-y-1`
          : 'border-gray-200 bg-gray-100 opacity-60 hover:opacity-80'}
      `}
    >
      {/* Badge icon */}
      <div
        className={`
          w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-2
          ${earned ? `bg-white shadow-md ${rarity.glow}` : 'bg-gray-200'}
          transition-transform duration-300
          ${earned ? 'animate-badge-glow' : ''}
        `}
      >
        {earned ? icon : '❓'}
      </div>

      {/* Name */}
      <div className={`text-xs font-bold truncate w-full ${earned ? 'text-rq-text' : 'text-gray-400'}`}>
        {earned ? badge.name : '???'}
      </div>

      {/* Rarity label */}
      <div className={`text-[10px] mt-0.5 font-semibold ${rarity.text}`}>{rarity.label}</div>

      {/* Earned date */}
      {earned && earnDate && (
        <div className="text-[9px] text-rq-muted mt-0.5">
          {new Date(earnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      )}

      {/* Hint for locked */}
      {!earned && badge.description && (
        <div className="text-[9px] text-gray-400 mt-0.5 line-clamp-2">{badge.description}</div>
      )}

      {/* XP reward pip */}
      {badge.xpReward > 0 && (
        <span className={`absolute -top-1.5 -right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
          earned ? 'bg-rq-purple text-white' : 'bg-gray-300 text-white'
        }`}>
          +{badge.xpReward}
        </span>
      )}
    </button>
  )
}

/**
 * Badge detail modal (displayed when user clicks a badge).
 */
export function BadgeModal({ badge, earned, earnDate, onClose }) {
  if (!badge) return null
  const rarity = RARITY_STYLES[badge.rarity] || RARITY_STYLES.common
  const icon = badge.icon || CATEGORY_ICONS[badge.category] || '🏅'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`bg-white rounded-2xl max-w-sm w-full p-6 border-2 ${rarity.border} shadow-2xl relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-rq-muted hover:text-rq-text text-xl">✕</button>

        <div className="flex flex-col items-center text-center">
          {/* Large icon */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-3 ${rarity.bg} border-2 ${rarity.border} shadow-lg`}>
            {earned ? icon : '❓'}
          </div>

          {/* Name */}
          <h3 className="font-display text-xl font-bold">{badge.name}</h3>

          {/* Rarity */}
          <span className={`text-xs font-bold mt-1 px-3 py-0.5 rounded-full ${rarity.bg} ${rarity.text}`}>
            {rarity.label}
          </span>

          {/* Category */}
          <span className="text-xs text-rq-muted mt-2 capitalize">{badge.category} badge</span>

          {/* Description */}
          <p className="text-sm text-rq-muted mt-3">{badge.description}</p>

          {/* XP */}
          {badge.xpReward > 0 && (
            <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-rq-purple">
              <span>⚡</span> +{badge.xpReward} XP
            </div>
          )}

          {/* Earned info */}
          {earned && earnDate ? (
            <div className="mt-4 bg-green-50 text-green-700 text-sm font-medium px-4 py-2 rounded-full">
              ✅ Earned on {new Date(earnDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          ) : !earned ? (
            <div className="mt-4 bg-gray-100 text-gray-500 text-sm font-medium px-4 py-2 rounded-full">
              🔒 Not yet earned
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
