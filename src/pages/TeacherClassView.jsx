import { useState, useEffect, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.ts'
import CreateChallengeModal from '../components/CreateChallengeModal'

// ─── Demo data: 15 students with realistic patterns ──────────────────────────
const DEMO_CLASSES = [
  { id: 'class-1', name: '4th Grade — Period 1', students: 15, grade: 4 },
  { id: 'class-2', name: '4th Grade — Period 3', students: 12, grade: 4 },
]

const DEMO_STUDENTS = [
  {
    id: 1, name: 'Sophia R.', avatar: '👩', booksMonth: 6, minutesWeek: 210, streak: 21, level: 18, xp: 4100,
    readingLevel: '830L', status: 'on-track',
    currentBooks: ['Harry Potter and the Goblet of Fire', 'The Wild Robot Escapes'],
    recentLogs: [
      { date: '2026-02-02', minutes: 35, book: 'Harry Potter' },
      { date: '2026-02-01', minutes: 40, book: 'Harry Potter' },
      { date: '2026-01-31', minutes: 30, book: 'The Wild Robot Escapes' },
    ],
    badges: ['🔥 Dedicated Reader', '🐉 Book Dragon', '🧙 Fantasy Fan'],
  },
  {
    id: 2, name: 'Ava C.', avatar: '👧', booksMonth: 7, minutesWeek: 250, streak: 28, level: 22, xp: 5200,
    readingLevel: '880L', status: 'on-track',
    currentBooks: ['The Hunger Games', 'Percy Jackson: Sea of Monsters'],
    recentLogs: [
      { date: '2026-02-02', minutes: 45, book: 'The Hunger Games' },
      { date: '2026-02-01', minutes: 50, book: 'The Hunger Games' },
      { date: '2026-01-31', minutes: 35, book: 'Percy Jackson' },
    ],
    badges: ['💪 Unstoppable', '🏅 Challenge Champion', '🦋 Social Butterfly'],
  },
  {
    id: 3, name: 'Maya L.', avatar: '👧', booksMonth: 5, minutesWeek: 185, streak: 12, level: 15, xp: 3200,
    readingLevel: '780L', status: 'on-track',
    currentBooks: ['Charlotte\'s Web'],
    recentLogs: [
      { date: '2026-02-02', minutes: 30, book: 'Charlotte\'s Web' },
      { date: '2026-02-01', minutes: 25, book: 'Charlotte\'s Web' },
      { date: '2026-01-31', minutes: 40, book: 'Charlotte\'s Web' },
    ],
    badges: ['📖 First Chapter', '⚔️ Week Warrior', '✍️ Critic'],
  },
  {
    id: 4, name: 'Noah W.', avatar: '👦', booksMonth: 5, minutesWeek: 175, streak: 16, level: 16, xp: 3500,
    readingLevel: '810L', status: 'on-track',
    currentBooks: ['Hatchet', 'Diary of a Wimpy Kid: Rodrick Rules'],
    recentLogs: [
      { date: '2026-02-02', minutes: 28, book: 'Hatchet' },
      { date: '2026-02-01', minutes: 35, book: 'Hatchet' },
      { date: '2026-01-31', minutes: 32, book: 'Diary of a Wimpy Kid' },
    ],
    badges: ['🏃 Marathon Reader', '🗺️ Adventure Seeker'],
  },
  {
    id: 5, name: 'Jayden M.', avatar: '🧑‍🎓', booksMonth: 4, minutesWeek: 155, streak: 14, level: 12, xp: 2750,
    readingLevel: '720L', status: 'on-track',
    currentBooks: ['Percy Jackson & The Lightning Thief'],
    recentLogs: [
      { date: '2026-02-02', minutes: 35, book: 'Percy Jackson' },
      { date: '2026-02-01', minutes: 28, book: 'Percy Jackson' },
      { date: '2026-01-31', minutes: 25, book: 'Percy Jackson' },
    ],
    badges: ['🐛 Bookworm', '🔥 Dedicated Reader'],
  },
  {
    id: 6, name: 'Emma T.', avatar: '👧', booksMonth: 4, minutesWeek: 130, streak: 10, level: 11, xp: 2400,
    readingLevel: '750L', status: 'at-risk',
    currentBooks: ['Wonder'],
    recentLogs: [
      { date: '2026-02-02', minutes: 20, book: 'Wonder' },
      { date: '2026-02-01', minutes: 22, book: 'Wonder' },
      { date: '2026-01-30', minutes: 18, book: 'Wonder' },
    ],
    badges: ['📖 First Chapter', '🧙 Fantasy Fan'],
  },
  {
    id: 7, name: 'Ethan K.', avatar: '👦', booksMonth: 3, minutesWeek: 95, streak: 7, level: 9, xp: 1800,
    readingLevel: '690L', status: 'at-risk',
    currentBooks: ['Dog Man: Fetch-22'],
    recentLogs: [
      { date: '2026-02-01', minutes: 18, book: 'Dog Man' },
      { date: '2026-01-31', minutes: 20, book: 'Dog Man' },
      { date: '2026-01-30', minutes: 15, book: 'Dog Man' },
    ],
    badges: ['📖 First Chapter', '⚔️ Week Warrior'],
  },
  {
    id: 8, name: 'James H.', avatar: '👦', booksMonth: 3, minutesWeek: 110, streak: 5, level: 8, xp: 1600,
    readingLevel: '700L', status: 'at-risk',
    currentBooks: ['Holes', 'Amulet: The Stonekeeper'],
    recentLogs: [
      { date: '2026-02-02', minutes: 22, book: 'Holes' },
      { date: '2026-02-01', minutes: 18, book: 'Holes' },
      { date: '2026-01-30', minutes: 20, book: 'Amulet' },
    ],
    badges: ['📖 First Chapter'],
  },
  {
    id: 9, name: 'Isabella M.', avatar: '👧', booksMonth: 4, minutesWeek: 160, streak: 9, level: 14, xp: 2900,
    readingLevel: '770L', status: 'on-track',
    currentBooks: ['Wings of Fire: The Hidden Kingdom'],
    recentLogs: [
      { date: '2026-02-02', minutes: 30, book: 'Wings of Fire' },
      { date: '2026-02-01', minutes: 28, book: 'Wings of Fire' },
      { date: '2026-01-31', minutes: 35, book: 'Wings of Fire' },
    ],
    badges: ['🐉 Book Dragon', '🔥 Week Warrior'],
  },
  {
    id: 10, name: 'Lucas G.', avatar: '👦', booksMonth: 2, minutesWeek: 80, streak: 4, level: 7, xp: 1200,
    readingLevel: '650L', status: 'at-risk',
    currentBooks: ['Diary of a Wimpy Kid'],
    recentLogs: [
      { date: '2026-02-01', minutes: 15, book: 'Diary of a Wimpy Kid' },
      { date: '2026-01-31', minutes: 12, book: 'Diary of a Wimpy Kid' },
      { date: '2026-01-29', minutes: 18, book: 'Diary of a Wimpy Kid' },
    ],
    badges: ['📖 First Chapter'],
  },
  {
    id: 11, name: 'Olivia P.', avatar: '👧', booksMonth: 1, minutesWeek: 35, streak: 0, level: 3, xp: 400,
    readingLevel: '580L', status: 'behind',
    currentBooks: ['The One and Only Ivan'],
    recentLogs: [
      { date: '2026-01-30', minutes: 10, book: 'The One and Only Ivan' },
      { date: '2026-01-27', minutes: 15, book: 'The One and Only Ivan' },
    ],
    badges: [],
  },
  {
    id: 12, name: 'Liam D.', avatar: '🧑', booksMonth: 2, minutesWeek: 60, streak: 3, level: 5, xp: 900,
    readingLevel: '620L', status: 'behind',
    currentBooks: ['Percy Jackson & The Lightning Thief'],
    recentLogs: [
      { date: '2026-02-02', minutes: 12, book: 'Percy Jackson' },
      { date: '2026-02-01', minutes: 10, book: 'Percy Jackson' },
      { date: '2026-01-31', minutes: 8, book: 'Percy Jackson' },
    ],
    badges: ['📖 First Chapter'],
  },
  {
    id: 13, name: 'Charlotte B.', avatar: '👧', booksMonth: 3, minutesWeek: 140, streak: 8, level: 10, xp: 2100,
    readingLevel: '730L', status: 'at-risk',
    currentBooks: ['The Secret Garden'],
    recentLogs: [
      { date: '2026-02-02', minutes: 25, book: 'The Secret Garden' },
      { date: '2026-02-01', minutes: 20, book: 'The Secret Garden' },
      { date: '2026-01-31', minutes: 22, book: 'The Secret Garden' },
    ],
    badges: ['📖 First Chapter', '🌱 Getting Started'],
  },
  {
    id: 14, name: 'Mason R.', avatar: '👦', booksMonth: 2, minutesWeek: 70, streak: 2, level: 6, xp: 1050,
    readingLevel: '640L', status: 'behind',
    currentBooks: ['Captain Underpants'],
    recentLogs: [
      { date: '2026-02-01', minutes: 15, book: 'Captain Underpants' },
      { date: '2026-01-30', minutes: 12, book: 'Captain Underpants' },
    ],
    badges: ['📖 First Chapter'],
  },
  {
    id: 15, name: 'Aria J.', avatar: '👧', booksMonth: 5, minutesWeek: 190, streak: 18, level: 17, xp: 3700,
    readingLevel: '820L', status: 'on-track',
    currentBooks: ['A Wrinkle in Time', 'The Phantom Tollbooth'],
    recentLogs: [
      { date: '2026-02-02', minutes: 32, book: 'A Wrinkle in Time' },
      { date: '2026-02-01', minutes: 38, book: 'A Wrinkle in Time' },
      { date: '2026-01-31', minutes: 28, book: 'The Phantom Tollbooth' },
    ],
    badges: ['🐉 Book Dragon', '🔥 Dedicated Reader', '✍️ First Review'],
  },
]

// ─── Weekly trend data (last 4 weeks) ─────────────────────────────────────────
const DEMO_TRENDS = [
  { week: 'Jan 13', totalMinutes: 1650 },
  { week: 'Jan 20', totalMinutes: 1820 },
  { week: 'Jan 27', totalMinutes: 1940 },
  { week: 'Feb 3', totalMinutes: 2045 },
]

function getStatusInfo(minutesWeek) {
  if (minutesWeek >= 150) return { status: 'on-track', label: '✅ On Track', color: 'bg-green-100 text-green-700' }
  if (minutesWeek >= 75) return { status: 'at-risk', label: '⚠️ At Risk', color: 'bg-yellow-100 text-yellow-700' }
  return { status: 'behind', label: '🔴 Behind', color: 'bg-red-100 text-red-700' }
}

export default function TeacherClassView() {
  const [students, setStudents] = useState(DEMO_STUDENTS)
  const [classes, setClasses] = useState(DEMO_CLASSES)
  const [selectedClass, setSelectedClass] = useState(DEMO_CLASSES[0].id)
  const [expandedStudent, setExpandedStudent] = useState(null)
  const [showChallengeModal, setShowChallengeModal] = useState(false)
  const [sortBy, setSortBy] = useState('name') // name | minutes | streak | level | status
  const [sortDir, setSortDir] = useState('asc')
  const [loading, setLoading] = useState(true)
  const [trends, setTrends] = useState(DEMO_TRENDS)

  useEffect(() => {
    loadClassData()
  }, [selectedClass])

  async function loadClassData() {
    setLoading(true)

    if (isSupabaseConfigured) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Fetch teacher's classes
          const { data: classData } = await supabase
            .from('classes')
            .select('*')
            .eq('teacher_id', user.id)
          if (classData?.length) {
            setClasses(classData.map((c) => ({ id: c.id, name: c.name, students: 0, grade: c.grade_level })))
            if (!classData.find((c) => c.id === selectedClass)) {
              setSelectedClass(classData[0].id)
            }
          }

          // Fetch students in selected class
          const { data: memberships } = await supabase
            .from('class_memberships')
            .select('*, profiles:user_id(id, display_name, avatar_url, xp, level, current_streak)')
            .eq('class_id', selectedClass)
            .eq('role', 'student')

          if (memberships?.length) {
            const studentData = await Promise.all(
              memberships.map(async (m) => {
                const profile = m.profiles
                // Fetch reading logs for this week
                const weekStart = new Date()
                weekStart.setDate(weekStart.getDate() - 7)
                const { data: logs } = await supabase
                  .from('reading_logs')
                  .select('minutes_read, created_at, books(title)')
                  .eq('user_id', profile.id)
                  .gte('created_at', weekStart.toISOString())

                const minutesWeek = logs?.reduce((a, l) => a + (l.minutes_read || 0), 0) || 0

                return {
                  id: profile.id,
                  name: profile.display_name,
                  avatar: profile.avatar_url || '🧑',
                  booksMonth: 0, // would need another query
                  minutesWeek,
                  streak: profile.current_streak || 0,
                  level: profile.level || 1,
                  xp: profile.xp || 0,
                  readingLevel: '—',
                  ...getStatusInfo(minutesWeek),
                  currentBooks: [],
                  recentLogs: logs?.slice(0, 3).map((l) => ({
                    date: l.created_at?.split('T')[0],
                    minutes: l.minutes_read,
                    book: l.books?.title || 'Unknown',
                  })) || [],
                  badges: [],
                }
              })
            )
            setStudents(studentData)
          }
        }
      } catch (err) {
        console.error('Error loading class data:', err)
      }
    }

    setLoading(false)
  }

  // ─── Sorting ─────────────────────────────────────────────────────────
  function handleSort(col) {
    if (sortBy === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(col)
      setSortDir(col === 'name' ? 'asc' : 'desc')
    }
  }

  const sortedStudents = [...students].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1
    switch (sortBy) {
      case 'name': return dir * a.name.localeCompare(b.name)
      case 'books': return dir * (a.booksMonth - b.booksMonth)
      case 'minutes': return dir * (a.minutesWeek - b.minutesWeek)
      case 'streak': return dir * (a.streak - b.streak)
      case 'level': return dir * (a.level - b.level)
      case 'status': {
        const order = { 'behind': 0, 'at-risk': 1, 'on-track': 2 }
        return dir * ((order[getStatusInfo(a.minutesWeek).status] || 0) - (order[getStatusInfo(b.minutesWeek).status] || 0))
      }
      default: return 0
    }
  })

  // ─── Computed stats ──────────────────────────────────────────────────
  const totalStudents = students.length
  const avgMinutes = totalStudents ? Math.round(students.reduce((a, s) => a + s.minutesWeek, 0) / totalStudents) : 0
  const classStreak = Math.round(students.reduce((a, s) => a + s.streak, 0) / (totalStudents || 1))
  const booksFinished = students.reduce((a, s) => a + s.booksMonth, 0)
  const onTrackCount = students.filter((s) => getStatusInfo(s.minutesWeek).status === 'on-track').length
  const atRiskCount = students.filter((s) => getStatusInfo(s.minutesWeek).status === 'at-risk').length
  const behindCount = students.filter((s) => getStatusInfo(s.minutesWeek).status === 'behind').length
  const maxTrendMinutes = Math.max(...trends.map((t) => t.totalMinutes), 1)

  // ─── Export report ───────────────────────────────────────────────────
  function handleExport() {
    const className = classes.find((c) => c.id === selectedClass)?.name || 'Class'
    const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

    let report = `ReadQuest Class Report\n`
    report += `${className} — Generated ${date}\n`
    report += `${'='.repeat(60)}\n\n`
    report += `SUMMARY\n`
    report += `  Students: ${totalStudents}\n`
    report += `  Avg Minutes/Week: ${avgMinutes}\n`
    report += `  Class Avg Streak: ${classStreak} days\n`
    report += `  Books Finished This Month: ${booksFinished}\n`
    report += `  On Track: ${onTrackCount} | At Risk: ${atRiskCount} | Behind: ${behindCount}\n\n`
    report += `${'─'.repeat(60)}\n`
    report += `STUDENT DETAILS\n\n`

    sortedStudents.forEach((s) => {
      const si = getStatusInfo(s.minutesWeek)
      report += `  ${s.name}\n`
      report += `    Level: ${s.level} | XP: ${s.xp.toLocaleString()} | Reading Level: ${s.readingLevel}\n`
      report += `    Minutes/Week: ${s.minutesWeek} | Books/Month: ${s.booksMonth} | Streak: ${s.streak} days\n`
      report += `    Status: ${si.label}\n`
      if (s.currentBooks.length) report += `    Currently Reading: ${s.currentBooks.join(', ')}\n`
      if (s.badges.length) report += `    Badges: ${s.badges.join(', ')}\n`
      report += `\n`
    })

    report += `${'─'.repeat(60)}\n`
    report += `READING TRENDS (Last 4 Weeks)\n\n`
    trends.forEach((t) => {
      report += `  ${t.week}: ${t.totalMinutes.toLocaleString()} minutes\n`
    })

    // Create download
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `readquest-report-${className.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const currentClassName = classes.find((c) => c.id === selectedClass)?.name || 'Class'

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl" />)}
          </div>
          <div className="h-64 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Class Dashboard 📊</h1>
          <p className="text-rq-muted">Real-time reading overview for your students</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Class selector */}
          {classes.length > 1 && (
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-white border border-purple-200 rounded-xl px-4 py-2 text-sm font-medium text-rq-text focus:outline-none focus:border-rq-purple focus:ring-2 focus:ring-purple-100"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
          <button
            onClick={() => setShowChallengeModal(true)}
            className="bg-gradient-to-r from-rq-purple to-rq-purple-light text-white px-5 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-purple-200 transition-all"
          >
            🏆 Create Challenge
          </button>
          <button
            onClick={handleExport}
            className="bg-white border border-purple-200 text-rq-purple px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-purple-50 transition-colors"
          >
            📋 Export Report
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="👥" label="Total Students" value={totalStudents} accent="purple" />
        <StatCard icon="⏱️" label="Avg Min/Week" value={avgMinutes} accent="teal" sub={avgMinutes >= 150 ? '✅ On target' : '⚠️ Below target'} />
        <StatCard icon="🔥" label="Class Avg Streak" value={`${classStreak}d`} accent="orange" />
        <StatCard icon="📚" label="Books This Month" value={booksFinished} accent="blue" />
      </div>

      {/* Status overview + mini chart row */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Status breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-4">🏥 Reading Health</h3>
          <div className="space-y-3 mb-4">
            <StatusBar label="On Track (≥150 min)" count={onTrackCount} total={totalStudents} color="green" />
            <StatusBar label="At Risk (75–149 min)" count={atRiskCount} total={totalStudents} color="yellow" />
            <StatusBar label="Behind (<75 min)" count={behindCount} total={totalStudents} color="red" />
          </div>
          <div className="flex h-5 rounded-full overflow-hidden">
            <div className="bg-green-400 transition-all" style={{ width: `${(onTrackCount / totalStudents) * 100}%` }} />
            <div className="bg-yellow-400 transition-all" style={{ width: `${(atRiskCount / totalStudents) * 100}%` }} />
            <div className="bg-red-400 transition-all" style={{ width: `${(behindCount / totalStudents) * 100}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-rq-muted">
            <span>{Math.round((onTrackCount / totalStudents) * 100)}% on track</span>
            <span>{Math.round((behindCount / totalStudents) * 100)}% need support</span>
          </div>
        </div>

        {/* Reading Trends mini-chart */}
        <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-4">📈 Reading Trends (4 Weeks)</h3>
          <div className="flex items-end gap-3 h-36">
            {trends.map((t, i) => {
              const pct = (t.totalMinutes / maxTrendMinutes) * 100
              const isLatest = i === trends.length - 1
              return (
                <div key={t.week} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold text-rq-purple">{t.totalMinutes.toLocaleString()}</span>
                  <div className="w-full relative" style={{ height: `${pct}%`, minHeight: '12px' }}>
                    <div
                      className={`w-full h-full rounded-t-lg transition-all ${
                        isLatest
                          ? 'bg-gradient-to-t from-rq-purple to-rq-teal'
                          : 'bg-gradient-to-t from-purple-200 to-purple-100'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-rq-muted">{t.week}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-3 text-xs text-rq-muted text-center">
            {trends.length >= 2 && (
              <>
                {trends[trends.length - 1].totalMinutes > trends[trends.length - 2].totalMinutes
                  ? `📈 Up ${Math.round(((trends[trends.length - 1].totalMinutes - trends[trends.length - 2].totalMinutes) / trends[trends.length - 2].totalMinutes) * 100)}% from last week`
                  : `📉 Down from last week`
                }
              </>
            )}
          </div>
        </div>
      </div>

      {/* Student table */}
      <div className="bg-white rounded-2xl border border-purple-50 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-purple-50 flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-display font-semibold text-lg">👥 Students — {currentClassName}</h3>
          <div className="text-xs text-rq-muted">
            Click a column header to sort · Click a student to expand details
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-rq-muted uppercase">
                <SortHeader label="Student" col="name" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
                <SortHeader label="Books/Mo" col="books" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
                <SortHeader label="Min/Week" col="minutes" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
                <SortHeader label="Streak" col="streak" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
                <SortHeader label="Reading Lvl" col="level" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
                <SortHeader label="Status" col="status" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {sortedStudents.map((student) => {
                const si = getStatusInfo(student.minutesWeek)
                const isExpanded = expandedStudent === student.id
                return (
                  <StudentRows
                    key={student.id}
                    student={student}
                    statusInfo={si}
                    isExpanded={isExpanded}
                    onToggle={() => setExpandedStudent(isExpanded ? null : student.id)}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Challenge modal */}
      {showChallengeModal && (
        <CreateChallengeModal
          onClose={() => setShowChallengeModal(false)}
          onSubmit={(challenge) => {
            console.log('Challenge created:', challenge)
            // Would save to Supabase here
          }}
          students={students}
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════ */

function StatCard({ icon, label, value, accent, sub }) {
  const accents = {
    purple: 'from-purple-100 to-purple-50 border-purple-100',
    teal: 'from-teal-100 to-teal-50 border-teal-100',
    blue: 'from-blue-100 to-blue-50 border-blue-100',
    orange: 'from-orange-100 to-orange-50 border-orange-100',
  }
  return (
    <div className={`bg-gradient-to-br ${accents[accent]} rounded-2xl p-4 border`}>
      <span className="text-2xl">{icon}</span>
      <div className="font-display text-2xl font-bold mt-1">{value}</div>
      <div className="text-xs text-rq-muted">{label}</div>
      {sub && <div className="text-[10px] text-rq-muted mt-1">{sub}</div>}
    </div>
  )
}

function StatusBar({ label, count, total, color }) {
  const pct = total ? (count / total) * 100 : 0
  const colors = { green: 'bg-green-400', yellow: 'bg-yellow-400', red: 'bg-red-400' }
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-rq-muted w-36 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div className={`${colors[color]} h-full rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-bold w-6 text-right">{count}</span>
    </div>
  )
}

function SortHeader({ label, col, sortBy, sortDir, onClick }) {
  const active = sortBy === col
  return (
    <th
      className="px-5 py-3 cursor-pointer hover:text-rq-purple transition-colors select-none"
      onClick={() => onClick(col)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {active && <span className="text-rq-purple">{sortDir === 'asc' ? '↑' : '↓'}</span>}
      </div>
    </th>
  )
}

function StudentRows({ student, statusInfo, isExpanded, onToggle }) {
  return (
    <>
      <tr
        className="hover:bg-purple-50/30 transition-colors cursor-pointer"
        onClick={onToggle}
      >
        <td className="px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{student.avatar}</span>
            <div>
              <span className="font-semibold text-sm">{student.name}</span>
              <div className="text-[10px] text-rq-muted">Lv {student.level} · {student.xp.toLocaleString()} XP</div>
            </div>
            <span className="text-xs text-rq-muted ml-1">{isExpanded ? '▼' : '▶'}</span>
          </div>
        </td>
        <td className="px-5 py-3 text-sm font-medium">{student.booksMonth}</td>
        <td className="px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="w-20 bg-gray-100 rounded-full h-2">
              <div
                className={`h-full rounded-full transition-all ${
                  student.minutesWeek >= 150 ? 'bg-green-400'
                  : student.minutesWeek >= 75 ? 'bg-yellow-400'
                  : 'bg-red-400'
                }`}
                style={{ width: `${Math.min((student.minutesWeek / 250) * 100, 100)}%` }}
              />
            </div>
            <span className="text-xs text-rq-muted font-medium">{student.minutesWeek}</span>
          </div>
        </td>
        <td className="px-5 py-3 text-sm">
          {student.streak > 0 ? <span className="text-rq-orange font-medium">🔥 {student.streak}</span> : <span className="text-rq-muted">—</span>}
        </td>
        <td className="px-5 py-3 text-sm font-medium text-rq-purple">{student.readingLevel}</td>
        <td className="px-5 py-3">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </td>
      </tr>

      {/* Expanded detail row */}
      {isExpanded && (
        <tr className="bg-purple-50/20">
          <td colSpan={6} className="px-5 py-4">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Currently reading */}
              <div className="bg-white rounded-xl p-3 border border-purple-50">
                <h4 className="text-xs font-semibold text-rq-muted uppercase mb-2">📖 Currently Reading</h4>
                {student.currentBooks.length > 0 ? (
                  <ul className="space-y-1">
                    {student.currentBooks.map((book, i) => (
                      <li key={i} className="text-sm font-medium">• {book}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-rq-muted">No books in progress</p>
                )}
              </div>

              {/* Recent logs */}
              <div className="bg-white rounded-xl p-3 border border-purple-50">
                <h4 className="text-xs font-semibold text-rq-muted uppercase mb-2">📋 Recent Sessions</h4>
                {student.recentLogs.length > 0 ? (
                  <div className="space-y-1.5">
                    {student.recentLogs.map((log, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-rq-muted">{new Date(log.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span className="font-medium">{log.minutes} min</span>
                        <span className="text-rq-muted truncate max-w-[100px]">{log.book}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-rq-muted">No recent activity</p>
                )}
              </div>

              {/* Badges + XP */}
              <div className="bg-white rounded-xl p-3 border border-purple-50">
                <h4 className="text-xs font-semibold text-rq-muted uppercase mb-2">🏅 Badges & XP</h4>
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-rq-muted">XP Progress</span>
                    <span className="font-bold text-rq-purple">⚡ {student.xp.toLocaleString()}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="xp-bar h-full rounded-full" style={{ width: `${(student.xp % 500) / 5}%` }} />
                  </div>
                </div>
                {student.badges.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {student.badges.map((badge, i) => (
                      <span key={i} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                        {badge}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-rq-muted">No badges earned yet</p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
