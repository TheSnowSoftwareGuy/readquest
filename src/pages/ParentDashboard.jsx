import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.ts'
import ChildOverviewCard from '../components/ChildOverviewCard'

// ─── Demo data: 2 children with different reading patterns ────────────────────

const DEMO_CHILDREN = [
  {
    id: 'child-1',
    name: 'Emma M.',
    avatar: '👧',
    age: 7,
    grade: '2nd Grade',
    school: 'Oakwood Elementary',
    streak: 8,
    level: 6,
    xp: 920,
    xpForNext: 200,
    xpInLevel: 120,
    booksThisMonth: 3,
    currentBook: 'Ivy + Bean',
    currentBookCover: 'https://covers.openlibrary.org/b/isbn/9780811849098-M.jpg',
    weeklyData: [
      { week: 'Jan 13', minutes: 85, pages: 64, sessions: 5 },
      { week: 'Jan 20', minutes: 95, pages: 72, sessions: 6 },
      { week: 'Jan 27', minutes: 110, pages: 88, sessions: 7 },
      { week: 'Feb 3', minutes: 105, pages: 80, sessions: 6 },
    ],
    bookshelf: [
      { title: 'Ivy + Bean', cover: 'https://covers.openlibrary.org/b/isbn/9780811849098-M.jpg', shelf: 'Currently Reading' },
      { title: 'Dog Man: Fetch-22', cover: 'https://covers.openlibrary.org/b/isbn/9781338323214-M.jpg', shelf: 'Want to Read' },
      { title: 'The Bad Guys', cover: 'https://covers.openlibrary.org/b/isbn/9780545912402-M.jpg', shelf: 'Finished' },
    ],
    recentActivity: [
      { id: 1, type: 'book_complete', text: 'Finished "Junie B. Jones: Boss of Lunch"', time: '2 hours ago', icon: '📚' },
      { id: 2, type: 'badge_earned', text: 'Earned "Week Warrior" badge!', time: '1 day ago', icon: '🏅' },
      { id: 3, type: 'reading_session', text: 'Read 15 minutes of "Ivy + Bean"', time: '1 day ago', icon: '📖' },
      { id: 4, type: 'review', text: 'Reviewed "Junie B. Jones" — ⭐⭐⭐⭐⭐', time: '2 days ago', icon: '✍️' },
      { id: 5, type: 'reading_session', text: 'Read 20 minutes of "Ivy + Bean"', time: '2 days ago', icon: '📖' },
      { id: 6, type: 'xp_earned', text: 'Earned 25 XP for reading streak', time: '3 days ago', icon: '⚡' },
      { id: 7, type: 'badge_earned', text: 'Earned "Getting Started" badge!', time: '4 days ago', icon: '🏅' },
      { id: 8, type: 'reading_session', text: 'Read 18 minutes of "Junie B. Jones"', time: '4 days ago', icon: '📖' },
      { id: 9, type: 'book_added', text: 'Added "Dog Man: Fetch-22" to Want to Read', time: '5 days ago', icon: '📕' },
      { id: 10, type: 'reading_session', text: 'Read 12 minutes of "Junie B. Jones"', time: '6 days ago', icon: '📖' },
    ],
    badges: [
      { name: 'Week Warrior', icon: '⚔️', earned: '2026-02-01', rarity: 'common' },
      { name: 'Getting Started', icon: '🌱', earned: '2026-01-28', rarity: 'common' },
      { name: 'First Chapter', icon: '📖', earned: '2026-01-15', rarity: 'common' },
      { name: 'Friendly', icon: '🤝', earned: '2026-01-10', rarity: 'common' },
      { name: 'First Review', icon: '✍️', earned: '2026-01-20', rarity: 'common' },
    ],
    goals: [
      { id: 'g1', label: 'Teacher Goal: 15 min/day', target: 15, current: 15, type: 'teacher', unit: 'min' },
      { id: 'g2', label: 'Parent Goal: 20 min/day', target: 20, current: 15, type: 'parent', unit: 'min' },
    ],
    permissions: {
      socialFeatures: true,
      reviewVisibility: true,
      pushNotifications: true,
    },
  },
  {
    id: 'child-2',
    name: 'Lucas M.',
    avatar: '👦',
    age: 11,
    grade: '5th Grade',
    school: 'Oakwood Elementary',
    streak: 21,
    level: 18,
    xp: 4150,
    xpForNext: 500,
    xpInLevel: 350,
    booksThisMonth: 6,
    currentBook: 'Percy Jackson: The Lightning Thief',
    currentBookCover: 'https://covers.openlibrary.org/b/isbn/9780786838653-M.jpg',
    weeklyData: [
      { week: 'Jan 13', minutes: 195, pages: 145, sessions: 7 },
      { week: 'Jan 20', minutes: 210, pages: 158, sessions: 7 },
      { week: 'Jan 27', minutes: 230, pages: 170, sessions: 7 },
      { week: 'Feb 3', minutes: 245, pages: 182, sessions: 7 },
    ],
    bookshelf: [
      { title: 'Percy Jackson: The Lightning Thief', cover: 'https://covers.openlibrary.org/b/isbn/9780786838653-M.jpg', shelf: 'Currently Reading' },
      { title: 'Harry Potter and the Goblet of Fire', cover: 'https://covers.openlibrary.org/b/isbn/9780439139601-M.jpg', shelf: 'Currently Reading' },
      { title: 'The Wild Robot', cover: 'https://covers.openlibrary.org/b/isbn/9780316381994-M.jpg', shelf: 'Finished' },
    ],
    recentActivity: [
      { id: 1, type: 'level_up', text: 'Reached Level 18!', time: '3 hours ago', icon: '🎉' },
      { id: 2, type: 'reading_session', text: 'Read 40 minutes of "Percy Jackson"', time: '5 hours ago', icon: '📖' },
      { id: 3, type: 'badge_earned', text: 'Earned "Dedicated Reader" badge!', time: '1 day ago', icon: '🏅' },
      { id: 4, type: 'book_complete', text: 'Finished "The Wild Robot"', time: '1 day ago', icon: '📚' },
      { id: 5, type: 'review', text: 'Reviewed "The Wild Robot" — ⭐⭐⭐⭐⭐', time: '1 day ago', icon: '✍️' },
      { id: 6, type: 'challenge_complete', text: 'Completed "Fantasy February" challenge!', time: '2 days ago', icon: '🏆' },
      { id: 7, type: 'reading_session', text: 'Read 35 minutes of "Harry Potter"', time: '2 days ago', icon: '📖' },
      { id: 8, type: 'xp_earned', text: 'Earned 100 XP for completing a challenge', time: '2 days ago', icon: '⚡' },
      { id: 9, type: 'reading_session', text: 'Read 45 minutes of "Percy Jackson"', time: '3 days ago', icon: '📖' },
      { id: 10, type: 'badge_earned', text: 'Earned "Book Dragon" badge!', time: '4 days ago', icon: '🏅' },
    ],
    badges: [
      { name: 'Dedicated Reader', icon: '🔥', earned: '2026-02-01', rarity: 'rare' },
      { name: 'Book Dragon', icon: '🐉', earned: '2026-01-28', rarity: 'rare' },
      { name: 'Marathon Reader', icon: '🏃', earned: '2026-01-22', rarity: 'rare' },
      { name: 'Fantasy Fan', icon: '🧙', earned: '2026-01-18', rarity: 'rare' },
      { name: 'Thousand Pages', icon: '📚', earned: '2026-01-15', rarity: 'epic' },
    ],
    goals: [
      { id: 'g1', label: 'Teacher Goal: 30 min/day', target: 30, current: 35, type: 'teacher', unit: 'min' },
      { id: 'g2', label: 'Parent Goal: 30 min/day', target: 30, current: 35, type: 'parent', unit: 'min' },
    ],
    permissions: {
      socialFeatures: true,
      reviewVisibility: true,
      pushNotifications: false,
    },
  },
]

export default function ParentDashboard() {
  const [children, setChildren] = useState(DEMO_CHILDREN)
  const [selectedChildId, setSelectedChildId] = useState(DEMO_CHILDREN[0].id)
  const [loading, setLoading] = useState(true)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [goalMinutes, setGoalMinutes] = useState(20)
  const [permissions, setPermissions] = useState({})

  const selectedChild = children.find((c) => c.id === selectedChildId) || children[0]

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedChild) {
      setPermissions({ ...selectedChild.permissions })
    }
  }, [selectedChildId])

  async function loadData() {
    setLoading(true)

    if (isSupabaseConfigured) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Fetch parent's linked children
          const { data: links } = await supabase
            .from('parent_children')
            .select('child_id, profiles:child_id(id, display_name, avatar_url, xp, level, current_streak, grade_level)')
            .eq('parent_id', user.id)

          if (links?.length) {
            const childData = await Promise.all(
              links.map(async (link) => {
                const profile = link.profiles
                const weekStart = new Date()
                weekStart.setDate(weekStart.getDate() - 7)

                // Fetch weekly reading stats
                const { data: logs } = await supabase
                  .from('reading_logs')
                  .select('minutes_read, pages_read, created_at')
                  .eq('user_id', profile.id)
                  .gte('created_at', weekStart.toISOString())

                const minutesWeek = logs?.reduce((a, l) => a + (l.minutes_read || 0), 0) || 0

                // Fetch recent feed items
                const { data: feedItems } = await supabase
                  .from('feed_items')
                  .select('*')
                  .eq('user_id', profile.id)
                  .order('created_at', { ascending: false })
                  .limit(10)

                // Fetch badges
                const { data: badges } = await supabase
                  .from('user_badges')
                  .select('*, badges(*)')
                  .eq('user_id', profile.id)
                  .order('earned_at', { ascending: false })
                  .limit(5)

                return {
                  id: profile.id,
                  name: profile.display_name,
                  avatar: profile.avatar_url || '🧒',
                  grade: `Grade ${profile.grade_level || '?'}`,
                  school: 'School',
                  streak: profile.current_streak || 0,
                  level: profile.level || 1,
                  xp: profile.xp || 0,
                  xpForNext: 300,
                  xpInLevel: (profile.xp || 0) % 300,
                  booksThisMonth: 0,
                  currentBook: null,
                  currentBookCover: null,
                  weeklyData: [],
                  bookshelf: [],
                  recentActivity: feedItems?.map((f, i) => ({
                    id: i, type: f.type, text: f.content || f.type, time: new Date(f.created_at).toLocaleDateString(), icon: '📖',
                  })) || [],
                  badges: badges?.map((b) => ({
                    name: b.badges?.name, icon: b.badges?.icon, earned: b.earned_at, rarity: b.badges?.rarity,
                  })) || [],
                  goals: [],
                  permissions: { socialFeatures: true, reviewVisibility: true, pushNotifications: true },
                }
              })
            )
            if (childData.length) {
              setChildren(childData)
              setSelectedChildId(childData[0].id)
            }
          }
        }
      } catch (err) {
        console.error('Error loading parent data:', err)
      }
    }

    setLoading(false)
  }

  function handlePermissionToggle(key) {
    setPermissions((prev) => {
      const updated = { ...prev, [key]: !prev[key] }
      // Update the child in state too
      setChildren((cs) => cs.map((c) => c.id === selectedChildId ? { ...c, permissions: updated } : c))
      // Would save to Supabase
      return updated
    })
  }

  function handleSaveGoal() {
    setChildren((cs) =>
      cs.map((c) => {
        if (c.id !== selectedChildId) return c
        const existing = c.goals.find((g) => g.type === 'parent')
        if (existing) {
          return { ...c, goals: c.goals.map((g) => g.type === 'parent' ? { ...g, target: goalMinutes, label: `Parent Goal: ${goalMinutes} min/day` } : g) }
        }
        return { ...c, goals: [...c.goals, { id: 'g-new', label: `Parent Goal: ${goalMinutes} min/day`, target: goalMinutes, current: 0, type: 'parent', unit: 'min' }] }
      })
    )
    setShowGoalModal(false)
  }

  // ─── Computed ──────────────────────────────────────────────────────────
  const maxWeekMinutes = Math.max(...(selectedChild?.weeklyData?.map((w) => w.minutes) || [1]), 1)

  const rarityColors = {
    common: 'bg-gray-100 text-gray-700 border-gray-200',
    rare: 'bg-blue-50 text-blue-700 border-blue-200',
    epic: 'bg-purple-50 text-purple-700 border-purple-200',
    legendary: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2].map((i) => <div key={i} className="h-48 bg-gray-100 rounded-2xl" />)}
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
          <h1 className="font-display text-3xl font-bold">Parent Dashboard 👨‍👩‍👧‍👦</h1>
          <p className="text-rq-muted">Track your children's reading progress</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setGoalMinutes(selectedChild?.goals?.find((g) => g.type === 'parent')?.target || 20)
              setShowGoalModal(true)
            }}
            className="bg-gradient-to-r from-rq-purple to-rq-purple-light text-white px-5 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-purple-200 transition-all"
          >
            🎯 Set Reading Goal
          </button>
        </div>
      </div>

      {/* Child selector tabs */}
      {children.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all shrink-0 ${
                selectedChildId === child.id
                  ? 'bg-gradient-to-r from-rq-purple to-rq-purple-light text-white shadow-md shadow-purple-200'
                  : 'bg-white border border-purple-200 text-rq-muted hover:border-rq-purple hover:text-rq-purple'
              }`}
            >
              <span className="text-lg">{child.avatar}</span>
              <span>{child.name}</span>
              {child.streak > 0 && <span className="text-xs">🔥 {child.streak}</span>}
            </button>
          ))}
        </div>
      )}

      {/* Child Overview Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {children.map((child) => (
          <ChildOverviewCard
            key={child.id}
            child={child}
            onSelect={(id) => setSelectedChildId(id)}
          />
        ))}
      </div>

      {/* Selected child detail section */}
      {selectedChild && (
        <>
          <div className="bg-gradient-to-r from-purple-50 to-teal-50 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">{selectedChild.avatar}</span>
            <div>
              <span className="font-display font-bold text-lg">{selectedChild.name}</span>
              <span className="text-rq-muted text-sm ml-2">— Detailed View</span>
            </div>
          </div>

          {/* Weekly Reading Summary + Bar Chart */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Summary stats */}
            <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
              <h3 className="font-display font-semibold text-lg mb-4">📊 Weekly Summary</h3>
              {selectedChild.weeklyData.length > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center bg-purple-50 rounded-xl p-3">
                      <div className="text-2xl font-bold text-rq-purple">
                        {selectedChild.weeklyData[selectedChild.weeklyData.length - 1]?.minutes || 0}
                      </div>
                      <div className="text-[10px] text-rq-muted">Minutes</div>
                    </div>
                    <div className="text-center bg-teal-50 rounded-xl p-3">
                      <div className="text-2xl font-bold text-rq-teal">
                        {selectedChild.weeklyData[selectedChild.weeklyData.length - 1]?.pages || 0}
                      </div>
                      <div className="text-[10px] text-rq-muted">Pages</div>
                    </div>
                    <div className="text-center bg-orange-50 rounded-xl p-3">
                      <div className="text-2xl font-bold text-rq-orange">
                        {selectedChild.weeklyData[selectedChild.weeklyData.length - 1]?.sessions || 0}
                      </div>
                      <div className="text-[10px] text-rq-muted">Sessions</div>
                    </div>
                  </div>
                  {selectedChild.weeklyData.length >= 2 && (() => {
                    const curr = selectedChild.weeklyData[selectedChild.weeklyData.length - 1].minutes
                    const prev = selectedChild.weeklyData[selectedChild.weeklyData.length - 2].minutes
                    const diff = Math.round(((curr - prev) / prev) * 100)
                    return (
                      <div className="text-xs text-center text-rq-muted">
                        {diff >= 0 ? `📈 Up ${diff}% from last week` : `📉 Down ${Math.abs(diff)}% from last week`}
                      </div>
                    )
                  })()}
                </>
              ) : (
                <p className="text-sm text-rq-muted">No data yet this week</p>
              )}
            </div>

            {/* Bar chart */}
            <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
              <h3 className="font-display font-semibold text-lg mb-4">📈 Reading Trend (Last 4 Weeks)</h3>
              <div className="flex items-end gap-3 h-36">
                {selectedChild.weeklyData.map((w, i) => {
                  const pct = (w.minutes / maxWeekMinutes) * 100
                  const isLatest = i === selectedChild.weeklyData.length - 1
                  return (
                    <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-bold text-rq-purple">{w.minutes}</span>
                      <div className="w-full relative" style={{ height: `${pct}%`, minHeight: '12px' }}>
                        <div
                          className={`w-full h-full rounded-t-lg transition-all ${
                            isLatest
                              ? 'bg-gradient-to-t from-rq-purple to-rq-teal'
                              : 'bg-gradient-to-t from-purple-200 to-purple-100'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] text-rq-muted">{w.week}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Bookshelf preview */}
          <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm mb-6">
            <h3 className="font-display font-semibold text-lg mb-4">📚 Current Bookshelf</h3>
            {selectedChild.bookshelf.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {selectedChild.bookshelf.map((book, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    {book.cover ? (
                      <img src={book.cover} alt={book.title} className="w-10 h-14 rounded object-cover shadow-sm" />
                    ) : (
                      <div className="w-10 h-14 bg-gradient-to-br from-purple-200 to-teal-200 rounded flex items-center justify-center text-lg">📖</div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{book.title}</div>
                      <div className="text-[10px] text-rq-muted">{book.shelf}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-rq-muted">No books on shelf yet</p>
            )}
          </div>

          {/* Activity feed + Badges row */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Recent activity */}
            <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
              <h3 className="font-display font-semibold text-lg mb-4">🕐 Recent Activity</h3>
              {selectedChild.recentActivity.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {selectedChild.recentActivity.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <span className="text-lg mt-0.5 shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{item.text}</p>
                        <p className="text-[10px] text-rq-muted">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-rq-muted">No recent activity</p>
              )}
            </div>

            {/* Badges */}
            <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
              <h3 className="font-display font-semibold text-lg mb-4">🏅 Recent Achievements</h3>
              {selectedChild.badges.length > 0 ? (
                <div className="space-y-3">
                  {selectedChild.badges.map((badge, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${rarityColors[badge.rarity] || rarityColors.common}`}>
                      <span className="text-2xl">{badge.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">{badge.name}</div>
                        <div className="text-[10px] text-rq-muted capitalize">{badge.rarity}</div>
                      </div>
                      <div className="text-[10px] text-rq-muted shrink-0">
                        {new Date(badge.earned).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-rq-muted">No badges earned yet</p>
              )}
            </div>
          </div>

          {/* Reading Goals */}
          <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg">🎯 Reading Goals</h3>
              <button
                onClick={() => {
                  setGoalMinutes(selectedChild?.goals?.find((g) => g.type === 'parent')?.target || 20)
                  setShowGoalModal(true)
                }}
                className="text-xs text-rq-purple font-semibold hover:text-rq-purple-dark transition-colors"
              >
                Edit Goal →
              </button>
            </div>
            {selectedChild.goals.length > 0 ? (
              <div className="space-y-4">
                {selectedChild.goals.map((goal) => {
                  const pct = Math.min((goal.current / goal.target) * 100, 100)
                  const met = goal.current >= goal.target
                  return (
                    <div key={goal.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium">
                          {goal.type === 'teacher' ? '👩‍🏫' : '👨‍👩‍👧'} {goal.label}
                        </span>
                        <span className={`text-xs font-bold ${met ? 'text-green-600' : 'text-rq-muted'}`}>
                          {goal.current}/{goal.target} {goal.unit} {met && '✅'}
                        </span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            met ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-rq-purple to-rq-teal'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-rq-muted">No reading goals set yet. Tap "Set Reading Goal" above to get started!</p>
            )}
          </div>

          {/* Permission Controls */}
          <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm mb-6">
            <h3 className="font-display font-semibold text-lg mb-4">🛡️ Permission Controls</h3>
            <p className="text-xs text-rq-muted mb-4">Manage privacy and feature access for {selectedChild.name}</p>
            <div className="space-y-4">
              <ToggleRow
                label="Social Features"
                description="Allow participation in class feed, friend requests, and reactions"
                enabled={permissions.socialFeatures}
                onToggle={() => handlePermissionToggle('socialFeatures')}
              />
              <ToggleRow
                label="Review Visibility"
                description="Allow book reviews to be visible to classmates"
                enabled={permissions.reviewVisibility}
                onToggle={() => handlePermissionToggle('reviewVisibility')}
              />
              <ToggleRow
                label="Push Notifications"
                description="Send streak reminders, achievement alerts, and reading nudges"
                enabled={permissions.pushNotifications}
                onToggle={() => handlePermissionToggle('pushNotifications')}
              />
            </div>
          </div>
        </>
      )}

      {/* Set Reading Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowGoalModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl font-bold mb-2">🎯 Set Reading Goal</h2>
            <p className="text-sm text-rq-muted mb-6">
              Set a daily reading target for <strong>{selectedChild?.name}</strong>
            </p>
            <div className="mb-6">
              <label className="text-sm font-semibold text-rq-text block mb-2">Minutes per day</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={5}
                  value={goalMinutes}
                  onChange={(e) => setGoalMinutes(Number(e.target.value))}
                  className="flex-1 accent-purple-600"
                />
                <div className="bg-purple-50 rounded-xl px-4 py-2 text-center min-w-[80px]">
                  <span className="text-2xl font-bold text-rq-purple">{goalMinutes}</span>
                  <span className="text-xs text-rq-muted block">min/day</span>
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-rq-muted mt-1 px-1">
                <span>5 min</span>
                <span>60 min</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 mb-6 text-xs text-rq-muted">
              <strong>💡 Tip:</strong> The American Academy of Pediatrics recommends 15–20 minutes of daily reading for elementary-age children.
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowGoalModal(false)}
                className="flex-1 bg-gray-100 text-rq-muted px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGoal}
                className="flex-1 bg-gradient-to-r from-rq-purple to-rq-purple-light text-white px-4 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-purple-200 transition-all"
              >
                Save Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════ */

function ToggleRow({ label, description, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-rq-muted">{description}</div>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
          enabled ? 'bg-rq-purple' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}
