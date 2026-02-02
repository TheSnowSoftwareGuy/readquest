import { useState, useEffect } from 'react'

/**
 * Reusable XP progress bar with animated fill.
 *
 * Props:
 *   currentXP   — total accumulated XP
 *   level       — current level number
 *   levelTitle  — human-readable level name  (e.g. "Bookworm")
 *   levelEmoji  — emoji for the level         (e.g. "🐛")
 *   xpForNext   — XP needed to reach the *next* level (full bar width)
 *   xpInLevel   — XP earned *within* the current level so far
 *   compact     — render a smaller variant (no title row)
 */
export default function XPProgressBar({
  currentXP = 0,
  level = 1,
  levelTitle = 'New Reader',
  levelEmoji = '🌱',
  xpForNext = 300,
  xpInLevel = 0,
  compact = false,
}) {
  const [animatedWidth, setAnimatedWidth] = useState(0)
  const pct = Math.min((xpInLevel / xpForNext) * 100, 100)
  const remaining = Math.max(xpForNext - xpInLevel, 0)

  // Animate on mount / when values change
  useEffect(() => {
    const t = setTimeout(() => setAnimatedWidth(pct), 80)
    return () => clearTimeout(t)
  }, [pct])

  if (compact) {
    return (
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-semibold text-rq-purple">Lvl {level}</span>
          <span className="text-rq-muted">{remaining} XP to next level</span>
        </div>
        <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="xp-bar h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${animatedWidth}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{levelEmoji}</span>
          <div>
            <div className="font-display font-bold text-lg">
              Level {level} — {levelTitle}
            </div>
            <div className="text-sm text-rq-muted">{remaining} XP to next level</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-rq-purple">{currentXP.toLocaleString()} XP</div>
          <div className="text-xs text-rq-muted">
            / {(currentXP + remaining).toLocaleString()} XP
          </div>
        </div>
      </div>
      <div className="bg-gray-100 rounded-full h-4 overflow-hidden">
        <div
          className="xp-bar h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${animatedWidth}%` }}
        />
      </div>
    </div>
  )
}
