import { useState, useMemo } from 'react'

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const WEEKS = 12

/**
 * GitHub-style reading activity heatmap.
 * Shows the last 12 weeks of reading data.
 *
 * @param {{ data: Array<{ date: string, minutes: number }> }} props
 */
export default function CalendarHeatmap({ data = [] }) {
  const [tooltip, setTooltip] = useState(null)

  // Build date → minutes map
  const dateMap = useMemo(() => {
    const map = {}
    data.forEach(d => {
      const key = d.date
      map[key] = (map[key] || 0) + d.minutes
    })
    return map
  }, [data])

  // Build grid: 12 weeks × 7 days
  const { grid, months } = useMemo(() => {
    const today = new Date()
    const grid = []
    const monthSet = new Map()

    // Go back to the most recent Sunday, then back 11 more weeks
    const dayOfWeek = today.getDay()
    const endOfWeek = new Date(today)
    endOfWeek.setDate(today.getDate() + (6 - dayOfWeek)) // Saturday

    const startDate = new Date(endOfWeek)
    startDate.setDate(endOfWeek.getDate() - (WEEKS * 7 - 1))

    for (let w = 0; w < WEEKS; w++) {
      const week = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + w * 7 + d)
        const dateStr = date.toISOString().split('T')[0]
        const minutes = dateMap[dateStr] || 0
        const isFuture = date > today

        week.push({
          date: dateStr,
          minutes,
          isFuture,
          day: d,
          week: w,
        })

        // Track month labels
        if (d === 0) {
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`
          if (!monthSet.has(monthKey)) {
            monthSet.set(monthKey, {
              label: date.toLocaleString('default', { month: 'short' }),
              week: w,
            })
          }
        }
      }
      grid.push(week)
    }

    return { grid, months: Array.from(monthSet.values()) }
  }, [dateMap])

  // Color intensity based on minutes
  const getColor = (minutes, isFuture) => {
    if (isFuture) return 'bg-gray-50'
    if (minutes === 0) return 'bg-gray-100'
    if (minutes < 15) return 'bg-teal-200'
    if (minutes < 30) return 'bg-teal-300'
    if (minutes < 45) return 'bg-teal-400'
    if (minutes < 60) return 'bg-teal-500'
    return 'bg-teal-600'
  }

  // Stats
  const totalDays = Object.keys(dateMap).length
  const totalMinutes = Object.values(dateMap).reduce((a, b) => a + b, 0)

  return (
    <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg">📅 Reading Activity</h3>
        <div className="flex items-center gap-3 text-xs text-rq-muted">
          <span>{totalDays} active days</span>
          <span>·</span>
          <span>{totalMinutes} total min</span>
        </div>
      </div>

      {/* Month labels */}
      <div className="flex ml-8 mb-1">
        {months.map((m, i) => (
          <div
            key={i}
            className="text-[10px] text-rq-muted"
            style={{
              position: 'relative',
              left: `${m.week * (100 / WEEKS)}%`,
              marginRight: 'auto',
            }}
          >
            {m.label}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 pr-1 pt-0.5">
          {DAY_LABELS.map((label, i) => (
            <div key={i} className="h-3 w-6 text-[9px] text-rq-muted flex items-center justify-end leading-none">
              {label}
            </div>
          ))}
        </div>

        {/* Weeks */}
        <div className="flex gap-1 flex-1">
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1 flex-1">
              {week.map((cell) => (
                <div
                  key={cell.date}
                  className={`aspect-square rounded-sm ${getColor(cell.minutes, cell.isFuture)} transition-all cursor-pointer hover:ring-2 hover:ring-rq-purple/40 relative`}
                  style={{ minHeight: '12px' }}
                  onMouseEnter={() => setTooltip(cell)}
                  onMouseLeave={() => setTooltip(null)}
                >
                  {/* Tooltip */}
                  {tooltip?.date === cell.date && !cell.isFuture && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-rq-text text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap shadow-lg pointer-events-none">
                      <div className="font-semibold">{formatDate(cell.date)}</div>
                      <div>{cell.minutes > 0 ? `${cell.minutes} min read` : 'No reading'}</div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-rq-text" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-3">
        <span className="text-[10px] text-rq-muted mr-1">Less</span>
        <div className="w-3 h-3 rounded-sm bg-gray-100" />
        <div className="w-3 h-3 rounded-sm bg-teal-200" />
        <div className="w-3 h-3 rounded-sm bg-teal-300" />
        <div className="w-3 h-3 rounded-sm bg-teal-400" />
        <div className="w-3 h-3 rounded-sm bg-teal-500" />
        <div className="w-3 h-3 rounded-sm bg-teal-600" />
        <span className="text-[10px] text-rq-muted ml-1">More</span>
      </div>
    </div>
  )
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
