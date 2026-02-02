import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase.ts'
import { demoStudent } from '../data/mockData'

// ─── Demo leaderboard data (20 students with varied stats) ────────────────
const DEMO_STUDENTS = [
  { id: 's1',  name: 'Jayden M.',    avatar: '🧑‍🎓', xp: 2750, booksRead: 23, minutesRead: 4820, streak: 14 },
  { id: 's2',  name: 'Sophia L.',    avatar: '👩‍🎓', xp: 3210, booksRead: 28, minutesRead: 5340, streak: 21 },
  { id: 's3',  name: 'Ethan R.',     avatar: '🧑',   xp: 2980, booksRead: 25, minutesRead: 5100, streak: 18 },
  { id: 's4',  name: 'Olivia K.',    avatar: '👧',   xp: 2620, booksRead: 22, minutesRead: 4600, streak: 12 },
  { id: 's5',  name: 'Liam W.',      avatar: '👦',   xp: 2450, booksRead: 20, minutesRead: 4200, streak: 10 },
  { id: 's6',  name: 'Ava P.',       avatar: '👩',   xp: 2380, booksRead: 19, minutesRead: 4050, streak: 9 },
  { id: 's7',  name: 'Noah C.',      avatar: '🧒',   xp: 2200, booksRead: 18, minutesRead: 3800, streak: 7 },
  { id: 's8',  name: 'Emma T.',      avatar: '👱‍♀️', xp: 2100, booksRead: 17, minutesRead: 3600, streak: 11 },
  { id: 's9',  name: 'Mason B.',     avatar: '👨‍🦱', xp: 1980, booksRead: 16, minutesRead: 3400, streak: 6 },
  { id: 's10', name: 'Isabella G.',  avatar: '👩‍🦰', xp: 1850, booksRead: 15, minutesRead: 3200, streak: 8 },
  { id: 's11', name: 'Lucas D.',     avatar: '🧑‍🦱', xp: 1720, booksRead: 14, minutesRead: 2900, streak: 5 },
  { id: 's12', name: 'Mia J.',       avatar: '👧',   xp: 1600, booksRead: 13, minutesRead: 2700, streak: 4 },
  { id: 's13', name: 'Aiden H.',     avatar: '👦',   xp: 1480, booksRead: 12, minutesRead: 2500, streak: 3 },
  { id: 's14', name: 'Charlotte F.', avatar: '👩‍🦱', xp: 1350, booksRead: 11, minutesRead: 2300, streak: 6 },
  { id: 's15', name: 'James N.',     avatar: '🧑',   xp: 1200, booksRead: 10, minutesRead: 2100, streak: 2 },
  { id: 's16', name: 'Amelia S.',    avatar: '👩',   xp: 1080, booksRead: 9,  minutesRead: 1900, streak: 4 },
  { id: 's17', name: 'Benjamin V.',  avatar: '👦',   xp: 950,  booksRead: 8,  minutesRead: 1700, streak: 1 },
  { id: 's18', name: 'Harper Q.',    avatar: '👧',   xp: 820,  booksRead: 7,  minutesRead: 1500, streak: 3 },
  { id: 's19', name: 'Elijah A.',    avatar: '🧒',   xp: 680,  booksRead: 6,  minutesRead: 1200, streak: 2 },
  { id: 's20', name: 'Evelyn Z.',    avatar: '👩‍🦰', xp: 540,  booksRead: 5,  minutesRead: 1000, streak: 1 },
]

const CURRENT_USER_ID = 's1' // Jayden M. is the logged-in demo user

const METRICS = [
  { key: 'xp',          label: 'XP',            icon: '⚡', suffix: ' XP' },
  { key: 'booksRead',   label: 'Books Read',    icon: '📚', suffix: ' books' },
  { key: 'minutesRead', label: 'Minutes Read',  icon: '⏱️', suffix: ' min' },
  { key: 'streak',      label: 'Current Streak', icon: '🔥', suffix: ' days' },
]

const TABS = ['Class', 'School']
const TIME_PERIODS = ['This Week', 'This Month', 'All Time']

const MEDAL_STYLES = {
  1: { bg: 'from-yellow-200 to-yellow-100', border: 'border-yellow-300', icon: '🥇', text: 'text-yellow-700' },
  2: { bg: 'from-gray-200 to-gray-100', border: 'border-gray-300', icon: '🥈', text: 'text-gray-600' },
  3: { bg: 'from-orange-200 to-orange-100', border: 'border-orange-300', icon: '🥉', text: 'text-orange-700' },
}

export default function Leaderboards() {
  const [tab, setTab] = useState('Class')
  const [metric, setMetric] = useState('xp')
  const [timePeriod, setTimePeriod] = useState('All Time')
  const [students, setStudents] = useState(DEMO_STUDENTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  async function loadLeaderboard() {
    setLoading(true)

    if (isSupabaseConfigured) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Future: fetch real leaderboard data from Supabase
          // const { data } = await supabase.from('profiles').select('*').order('xp', { ascending: false }).limit(20)
        }
      } catch (err) {
        console.error('Error loading leaderboard:', err)
      }
    }

    setLoading(false)
  }

  // Sort students by selected metric
  const sorted = [...students].sort((a, b) => b[metric] - a[metric])

  // Simulate time period filtering (reduce values proportionally for demo)
  const getDisplayValue = (student, metricKey) => {
    const val = student[metricKey]
    if (timePeriod === 'This Week') return Math.round(val * 0.12)
    if (timePeriod === 'This Month') return Math.round(val * 0.35)
    return val
  }

  const currentMetric = METRICS.find(m => m.key === metric)

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-12 bg-gray-100 rounded-2xl" />
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Leaderboards 🏆</h1>
        <p className="text-rq-muted">See how you stack up against your classmates!</p>
      </div>

      {/* Controls row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Tab selector: Class / School */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t
                  ? 'bg-white text-rq-purple shadow-sm'
                  : 'text-rq-muted hover:text-rq-purple'
              }`}
            >
              {t === 'Class' ? '🏫' : '🏛️'} {t}
            </button>
          ))}
        </div>

        {/* Time period filter */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {TIME_PERIODS.map(tp => (
            <button
              key={tp}
              onClick={() => setTimePeriod(tp)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                timePeriod === tp
                  ? 'bg-white text-rq-purple shadow-sm'
                  : 'text-rq-muted hover:text-rq-purple'
              }`}
            >
              {tp}
            </button>
          ))}
        </div>

        {/* Metric selector */}
        <div className="flex bg-gray-100 rounded-xl p-1 flex-wrap sm:ml-auto">
          {METRICS.map(m => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                metric === m.key
                  ? 'bg-gradient-to-r from-rq-purple to-rq-purple-light text-white shadow-sm'
                  : 'text-rq-muted hover:text-rq-purple'
              }`}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scope badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs bg-purple-100 text-rq-purple px-3 py-1 rounded-full font-semibold">
          {tab === 'Class' ? "🏫 Ms. Rodriguez's Class" : '🏛️ Oakwood Elementary'}
        </span>
        <span className="text-xs text-rq-muted">
          {timePeriod} · Ranked by {currentMetric.label}
        </span>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[1, 0, 2].map((idx) => {
          const student = sorted[idx]
          if (!student) return null
          const rank = idx + 1
          const realRank = idx === 1 ? 1 : idx === 0 ? 2 : 3
          const medal = MEDAL_STYLES[realRank]
          const isCurrentUser = student.id === CURRENT_USER_ID
          const displayVal = getDisplayValue(student, metric)

          return (
            <div
              key={student.id}
              className={`bg-gradient-to-br ${medal.bg} ${medal.border} border-2 rounded-2xl p-4 text-center transition-all hover:shadow-md ${
                realRank === 1 ? 'sm:-mt-4 sm:pb-6' : ''
              } ${isCurrentUser ? 'ring-2 ring-rq-purple ring-offset-2' : ''}`}
            >
              <div className="text-3xl mb-1">{medal.icon}</div>
              <div className="text-3xl mb-2">{student.avatar}</div>
              <div className={`font-display font-bold text-sm ${isCurrentUser ? 'text-rq-purple' : medal.text}`}>
                {student.name}
                {isCurrentUser && <span className="text-xs ml-1">(You)</span>}
              </div>
              <div className="font-display text-2xl font-bold mt-1">
                {displayVal.toLocaleString()}
              </div>
              <div className="text-xs text-rq-muted">{currentMetric.label}</div>
            </div>
          )
        })}
      </div>

      {/* Full leaderboard table */}
      <div className="bg-white rounded-2xl border border-purple-50 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-purple-50/50 border-b border-purple-100 text-xs font-semibold text-rq-muted uppercase tracking-wide">
          <div className="col-span-1">Rank</div>
          <div className="col-span-1"></div>
          <div className="col-span-6 sm:col-span-5">Student</div>
          <div className="col-span-4 sm:col-span-5 text-right">{currentMetric.icon} {currentMetric.label}</div>
        </div>

        {/* Table rows */}
        {sorted.map((student, idx) => {
          const rank = idx + 1
          const isCurrentUser = student.id === CURRENT_USER_ID
          const medal = MEDAL_STYLES[rank]
          const displayVal = getDisplayValue(student, metric)

          return (
            <div
              key={student.id}
              className={`grid grid-cols-12 gap-2 px-5 py-3 items-center transition-colors ${
                isCurrentUser
                  ? 'bg-purple-50 border-l-4 border-l-rq-purple'
                  : 'hover:bg-purple-50/30 border-l-4 border-l-transparent'
              } ${idx < sorted.length - 1 ? 'border-b border-purple-50' : ''}`}
            >
              {/* Rank */}
              <div className="col-span-1">
                {medal ? (
                  <span className="text-lg">{medal.icon}</span>
                ) : (
                  <span className={`text-sm font-bold ${isCurrentUser ? 'text-rq-purple' : 'text-rq-muted'}`}>
                    #{rank}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div className="col-span-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                  medal
                    ? `bg-gradient-to-br ${medal.bg}`
                    : 'bg-gradient-to-br from-purple-100 to-teal-100'
                }`}>
                  {student.avatar}
                </div>
              </div>

              {/* Name */}
              <div className="col-span-6 sm:col-span-5">
                <span className={`text-sm font-semibold ${isCurrentUser ? 'text-rq-purple' : 'text-rq-text'}`}>
                  {student.name}
                </span>
                {isCurrentUser && (
                  <span className="ml-2 text-[10px] bg-rq-purple text-white px-2 py-0.5 rounded-full font-semibold">
                    YOU
                  </span>
                )}
              </div>

              {/* Metric value */}
              <div className="col-span-4 sm:col-span-5 text-right">
                <span className={`font-display font-bold ${
                  rank <= 3 ? 'text-rq-purple text-lg' : 'text-rq-text'
                }`}>
                  {displayVal.toLocaleString()}
                </span>
                <span className="text-xs text-rq-muted ml-1">{currentMetric.suffix}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Motivational footer */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-teal-50 rounded-2xl p-5 border border-purple-100 text-center">
        <p className="text-sm text-rq-muted">
          {(() => {
            const userRank = sorted.findIndex(s => s.id === CURRENT_USER_ID) + 1
            if (userRank === 1) return '🎉 You\'re in first place! Keep up the amazing work!'
            if (userRank <= 3) return `🌟 You're #${userRank}! Just a little more to reach the top!`
            if (userRank <= 10) return `💪 You're #${userRank}! Keep reading to climb the ranks!`
            return `📖 You're #${userRank} — every page you read moves you up!`
          })()}
        </p>
        <div className="flex justify-center gap-3 mt-3">
          <Link to="/reading-log" className="text-xs font-semibold text-rq-purple bg-white px-4 py-2 rounded-full border border-purple-100 hover:shadow-sm transition-all">
            📖 Log Reading
          </Link>
          <Link to="/achievements" className="text-xs font-semibold text-rq-purple bg-white px-4 py-2 rounded-full border border-purple-100 hover:shadow-sm transition-all">
            🏅 View Badges
          </Link>
        </div>
      </div>
    </div>
  )
}
