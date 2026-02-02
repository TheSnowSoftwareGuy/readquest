import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.ts'
import { demoStudent, xpForLevel, getLevelInfo } from '../data/mockData'
import XPProgressBar from '../components/XPProgressBar'
import BadgeCard, { BadgeModal } from '../components/BadgeCard'

// ─── Badge seed data from Supabase migration (00008) ──────────────────────
const BADGE_CATALOG = [
  // Reading
  { id: 'first-chapter',   name: 'First Chapter',     icon: '📖', description: 'Log your first reading session',               rarity: 'common',    category: 'reading', xpReward: 10 },
  { id: 'bookworm',        name: 'Bookworm',           icon: '🐛', description: 'Log 10 reading sessions',                      rarity: 'common',    category: 'reading', xpReward: 25 },
  { id: 'page-turner',     name: 'Page Turner',        icon: '📄', description: 'Read 100 pages total',                         rarity: 'common',    category: 'reading', xpReward: 25 },
  { id: 'marathon-reader',name: 'Marathon Reader',    icon: '🏃', description: 'Read for 60 minutes in a single session',      rarity: 'rare',      category: 'reading', xpReward: 50 },
  { id: 'book-dragon',     name: 'Book Dragon',        icon: '🐉', description: 'Finish 5 books',                               rarity: 'rare',      category: 'reading', xpReward: 75 },
  { id: 'library-legend',  name: 'Library Legend',      icon: '🏛️', description: 'Finish 25 books',                              rarity: 'epic',      category: 'reading', xpReward: 150 },
  { id: 'thousand-pages',  name: 'Thousand Pages',      icon: '📚', description: 'Read 1,000 pages total',                       rarity: 'epic',      category: 'reading', xpReward: 200 },
  { id: 'unstoppable',     name: 'Unstoppable',         icon: '💪', description: 'Finish 100 books',                             rarity: 'legendary', category: 'reading', xpReward: 500 },
  // Streak
  { id: 'getting-started', name: 'Getting Started',     icon: '🌱', description: 'Maintain a 3-day reading streak',              rarity: 'common',    category: 'streak',  xpReward: 15 },
  { id: 'week-warrior',    name: 'Week Warrior',        icon: '⚔️', description: 'Maintain a 7-day reading streak',              rarity: 'common',    category: 'streak',  xpReward: 30 },
  { id: 'dedicated-reader',name: 'Dedicated Reader',   icon: '🔥', description: 'Maintain a 30-day reading streak',             rarity: 'rare',      category: 'streak',  xpReward: 100 },
  { id: 'iron-will',       name: 'Iron Will',           icon: '🛡️', description: 'Maintain a 100-day reading streak',            rarity: 'epic',      category: 'streak',  xpReward: 300 },
  { id: 'year-of-reading', name: 'Year of Reading',     icon: '📅', description: 'Maintain a 365-day reading streak',            rarity: 'legendary', category: 'streak',  xpReward: 1000 },
  // Review
  { id: 'first-review',    name: 'First Review',        icon: '✍️', description: 'Write your first book review',                 rarity: 'common',    category: 'review',  xpReward: 10 },
  { id: 'critic',          name: 'Critic',              icon: '🧐', description: 'Write 10 book reviews',                        rarity: 'rare',      category: 'review',  xpReward: 50 },
  { id: 'literary-critic', name: 'Literary Critic',     icon: '🎓', description: 'Write 50 book reviews',                        rarity: 'epic',      category: 'review',  xpReward: 150 },
  // Genre
  { id: 'adventure-seeker',name: 'Adventure Seeker',   icon: '🧗', description: 'Finish 5 adventure books',                    rarity: 'rare',      category: 'genre',   xpReward: 50 },
  { id: 'science-explorer',name: 'Science Explorer',   icon: '🔬', description: 'Finish 5 science books',                      rarity: 'rare',      category: 'genre',   xpReward: 50 },
  { id: 'fantasy-fan',     name: 'Fantasy Fan',         icon: '🧙', description: 'Finish 5 fantasy books',                       rarity: 'rare',      category: 'genre',   xpReward: 50 },
  { id: 'history-buff',    name: 'History Buff',        icon: '🏺', description: 'Finish 5 history books',                       rarity: 'rare',      category: 'genre',   xpReward: 50 },
  { id: 'genre-master',    name: 'Genre Master',        icon: '👑', description: 'Earn 5 different genre badges',                rarity: 'legendary', category: 'genre',   xpReward: 500 },
  // Social
  { id: 'friendly',        name: 'Friendly',            icon: '🤝', description: 'Make your first friend on ReadQuest',          rarity: 'common',    category: 'social',  xpReward: 10 },
  { id: 'social-butterfly',name: 'Social Butterfly',   icon: '🦋', description: 'Make 10 friends',                              rarity: 'rare',      category: 'social',  xpReward: 50 },
  { id: 'helpful',         name: 'Helpful',             icon: '💡', description: 'Get 10 helpful votes on your reviews',         rarity: 'rare',      category: 'social',  xpReward: 50 },
  // Special
  { id: 'early-adopter',   name: 'Early Adopter',       icon: '🚀', description: 'Joined ReadQuest during the beta period',      rarity: 'legendary', category: 'special', xpReward: 100 },
  { id: 'challenge-champ', name: 'Challenge Champion',  icon: '🏅', description: 'Complete 10 challenges',                       rarity: 'epic',      category: 'special', xpReward: 200 },
]

// Demo earned badges
const DEMO_EARNED = {
  'first-chapter':   '2025-11-15',
  'bookworm':        '2025-12-02',
  'page-turner':     '2025-12-10',
  'book-dragon':     '2026-01-08',
  'getting-started': '2025-11-16',
  'week-warrior':    '2025-11-22',
  'dedicated-reader':'2026-01-05',
  'first-review':    '2025-11-20',
  'critic':          '2026-01-15',
  'fantasy-fan':     '2026-01-22',
  'friendly':        '2025-11-18',
  'social-butterfly':'2026-01-10',
  'early-adopter':   '2025-11-15',
  'marathon-reader': '2025-12-28',
  'thousand-pages':  '2026-01-25',
}

// Demo daily quests
const DEMO_QUESTS = [
  { id: 'q1', quest_type: 'read_minutes', description: 'Read for 20 minutes today', target_value: 20, current_value: 12, xp_reward: 25, coin_reward: 5, is_completed: false },
  { id: 'q2', quest_type: 'write_review', description: 'Write a book review', target_value: 1, current_value: 0, xp_reward: 30, coin_reward: 10, is_completed: false },
  { id: 'q3', quest_type: 'add_book', description: 'Add a book to your shelf', target_value: 1, current_value: 1, xp_reward: 15, coin_reward: 3, is_completed: true },
]

// Demo weekly challenge
const DEMO_WEEKLY = {
  title: 'Fantasy February',
  description: 'Read 4 fantasy books this month',
  progress: 2,
  total: 4,
  xp_reward: 100,
  ends_at: '2026-02-28T23:59:59Z',
  badge: BADGE_CATALOG.find(b => b.id === 'fantasy-fan'),
}

// Demo XP activity feed
const DEMO_XP_FEED = [
  { id: 1, description: 'Reading session — Percy Jackson', xp_amount: 15, event_type: 'reading_session', created_at: '2026-02-02T14:30:00Z' },
  { id: 2, description: 'Badge earned — Thousand Pages 📚', xp_amount: 200, event_type: 'badge_earned', created_at: '2026-01-25T11:00:00Z' },
  { id: 3, description: 'Daily quest completed', xp_amount: 25, event_type: 'daily_quest', created_at: '2026-01-25T10:15:00Z' },
  { id: 4, description: 'Book review — Wings of Fire', xp_amount: 15, event_type: 'review_written', created_at: '2026-01-24T16:00:00Z' },
  { id: 5, description: 'Finished Holes', xp_amount: 50, event_type: 'book_completed', created_at: '2026-01-23T19:30:00Z' },
  { id: 6, description: 'Reading session — Holes', xp_amount: 15, event_type: 'reading_session', created_at: '2026-01-23T18:45:00Z' },
  { id: 7, description: '7-day streak bonus', xp_amount: 30, event_type: 'streak_bonus', created_at: '2026-01-22T08:00:00Z' },
  { id: 8, description: 'Badge earned — Dedicated Reader 🔥', xp_amount: 100, event_type: 'badge_earned', created_at: '2026-01-05T10:00:00Z' },
]

const EVENT_ICONS = {
  reading_session: '📖',
  book_completed: '📚',
  review_written: '✍️',
  badge_earned: '🏅',
  daily_quest: '⭐',
  weekly_challenge: '🏆',
  streak_bonus: '🔥',
  first_login: '👋',
  social_interaction: '💬',
}

const CATEGORIES = ['all', 'reading', 'streak', 'review', 'genre', 'social', 'special']
const CAT_LABELS = { all: '🏅 All', reading: '📖 Reading', streak: '🔥 Streaks', review: '✍️ Reviews', genre: '🗺️ Genres', social: '👥 Social', special: '⭐ Special' }

export default function Achievements() {
  const [badges, setBadges] = useState(BADGE_CATALOG)
  const [earnedMap, setEarnedMap] = useState(DEMO_EARNED)
  const [quests, setQuests] = useState(DEMO_QUESTS)
  const [weeklyChallenge, setWeeklyChallenge] = useState(DEMO_WEEKLY)
  const [xpFeed, setXpFeed] = useState(DEMO_XP_FEED)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [badgeFilter, setBadgeFilter] = useState('all')

  // Load data
  useEffect(() => {
    loadAchievements()
  }, [])

  async function loadAchievements() {
    setLoading(true)

    if (isSupabaseConfigured) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Fetch profile
          const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
          setProfile(prof)

          // Fetch badges catalog
          const { data: badgeData } = await supabase.from('badges').select('*').eq('is_active', true).order('category').order('rarity')
          if (badgeData?.length) {
            setBadges(badgeData.map(b => ({
              ...b,
              icon: b.icon_url ? null : '🏅',
              xpReward: b.xp_reward,
            })))
          }

          // Fetch user badges
          const { data: userBadges } = await supabase.from('user_badges').select('badge_id, earned_at').eq('user_id', user.id)
          if (userBadges) {
            const map = {}
            userBadges.forEach(ub => { map[ub.badge_id] = ub.earned_at })
            setEarnedMap(map)
          }

          // Fetch daily quests
          const today = new Date().toISOString().split('T')[0]
          const { data: questData } = await supabase.from('daily_quests').select('*').eq('user_id', user.id).eq('quest_date', today)
          if (questData?.length) setQuests(questData)

          // Fetch active challenges
          const { data: challengeData } = await supabase
            .from('challenge_progress')
            .select('*, challenges(*)')
            .eq('user_id', user.id)
            .eq('is_completed', false)
            .limit(1)
          if (challengeData?.[0]) {
            const cp = challengeData[0]
            setWeeklyChallenge({
              title: cp.challenges.title,
              description: cp.challenges.description,
              progress: cp.current_value,
              total: cp.challenges.target_value,
              xp_reward: cp.challenges.xp_reward,
              ends_at: cp.challenges.ends_at,
            })
          }

          // Fetch XP feed
          const { data: xpData } = await supabase.from('xp_events').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
          if (xpData?.length) setXpFeed(xpData)
        }
      } catch (err) {
        console.error('Error loading achievements:', err)
      }
    }

    // Use demo student profile as fallback
    if (!profile) {
      const s = demoStudent
      const currentXP = s.xp % xpForLevel(s.level)
      const nextLevelXP = xpForLevel(s.level)
      setProfile({
        id: s.id,
        display_name: `${s.firstName} ${s.lastInitial}.`,
        xp: s.xp,
        level: s.level,
        book_coins: 125,
        currentXP,
        nextLevelXP,
        levelName: s.levelName,
        currentStreak: s.currentStreak,
        longestStreak: s.longestStreak,
        streakFreezeAvailable: 1,
      })
    }

    setLoading(false)
  }

  // Computed values
  const s = profile || {}
  const level = s.level || 1
  const levelInfo = getLevelInfo(level)
  const currentXP = s.currentXP ?? (s.xp % xpForLevel(level))
  const nextLevelXP = s.nextLevelXP ?? xpForLevel(level)
  const totalXP = s.xp || 0
  const streak = s.currentStreak || s.current_streak || 0
  const longestStreak = s.longestStreak || s.longest_streak || 0
  const streakFreeze = s.streakFreezeAvailable ?? s.streak_freeze_available ?? 0
  const bookCoins = s.book_coins ?? 125
  const earnedCount = Object.keys(earnedMap).length

  const filteredBadges = badgeFilter === 'all' ? badges : badges.filter(b => b.category === badgeFilter)

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-24 bg-gray-100 rounded-2xl" />
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {[...Array(8)].map((_,i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Achievements 🏆</h1>
        <p className="text-rq-muted">Track your progress, earn badges, and level up!</p>
      </div>

      {/* Top stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="⚡" label="Total XP" value={totalXP.toLocaleString()} accent="purple" badge={`Lvl ${level}`} />
        <StatCard icon="🔥" label="Day Streak" value={streak} accent="orange" badge={`Best: ${longestStreak}`} />
        <StatCard icon="🏅" label="Badges" value={`${earnedCount}/${badges.length}`} accent="teal" badge="Earned" />
        <StatCard
          icon="🪙"
          label="BookCoins"
          value={bookCoins}
          accent="yellow"
          badge="Balance"
        />
      </div>

      {/* XP Progress Bar */}
      <XPProgressBar
        currentXP={totalXP}
        level={level}
        levelTitle={s.levelName || levelInfo.name}
        levelEmoji={levelInfo.emoji}
        xpForNext={nextLevelXP}
        xpInLevel={currentXP}
      />

      {/* Streak + Quests + Weekly row */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {/* Streak card */}
        <StreakCard streak={streak} longestStreak={longestStreak} streakFreeze={streakFreeze} />

        {/* Daily quests */}
        <DailyQuestsPanel quests={quests} />

        {/* Weekly challenge */}
        <WeeklyChallengeCard challenge={weeklyChallenge} />
      </div>

      {/* Badge collection */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="font-display text-2xl font-bold">🏅 Badge Collection</h2>
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setBadgeFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  badgeFilter === cat
                    ? 'bg-gradient-to-r from-rq-purple to-rq-purple-light text-white shadow-md'
                    : 'bg-white text-rq-muted border border-purple-100 hover:border-rq-purple/30'
                }`}
              >
                {CAT_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {filteredBadges.map((badge) => (
            <BadgeCard
              key={badge.id || badge.name}
              badge={badge}
              earned={!!(earnedMap[badge.id] || earnedMap[badge.name])}
              earnDate={earnedMap[badge.id] || earnedMap[badge.name]}
              onClick={(b) => setSelectedBadge(b)}
            />
          ))}
        </div>
      </div>

      {/* XP Activity Feed */}
      <div className="mt-8">
        <h2 className="font-display text-2xl font-bold mb-4">⚡ Recent XP Activity</h2>
        <div className="bg-white rounded-2xl border border-purple-50 shadow-sm divide-y divide-purple-50">
          {xpFeed.map((event) => (
            <div key={event.id} className="flex items-center gap-3 px-5 py-3 hover:bg-purple-50/30 transition-colors">
              <span className="text-xl">{EVENT_ICONS[event.event_type] || '⚡'}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{event.description}</div>
                <div className="text-xs text-rq-muted">
                  {new Date(event.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {' · '}
                  {new Date(event.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </div>
              </div>
              <span className={`font-bold text-sm ${event.xp_amount >= 100 ? 'text-rq-orange' : 'text-rq-purple'}`}>
                +{event.xp_amount} XP
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Badge detail modal */}
      {selectedBadge && (
        <BadgeModal
          badge={selectedBadge}
          earned={!!(earnedMap[selectedBadge.id] || earnedMap[selectedBadge.name])}
          earnDate={earnedMap[selectedBadge.id] || earnedMap[selectedBadge.name]}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════ */

function StatCard({ icon, label, value, accent, badge }) {
  const accents = {
    purple: 'from-purple-100 to-purple-50 border-purple-100',
    teal: 'from-teal-100 to-teal-50 border-teal-100',
    orange: 'from-orange-100 to-orange-50 border-orange-100',
    yellow: 'from-yellow-100 to-yellow-50 border-yellow-100',
    blue: 'from-blue-100 to-blue-50 border-blue-100',
  }
  return (
    <div className={`bg-gradient-to-br ${accents[accent]} rounded-2xl p-4 border`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-2xl">{icon}</span>
        {badge && <span className="text-[10px] bg-white/70 rounded-full px-2 py-0.5 text-rq-muted font-medium">{badge}</span>}
      </div>
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="text-xs text-rq-muted">{label}</div>
    </div>
  )
}

function StreakCard({ streak, longestStreak, streakFreeze }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
      <h3 className="font-display font-semibold text-lg mb-3">🔥 Reading Streak</h3>

      {/* Current streak - big display */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <span className="text-5xl animate-bounce-slow">🔥</span>
          {streak >= 7 && <span className="absolute -top-1 -right-1 text-2xl animate-pulse">✨</span>}
        </div>
        <div>
          <div className="font-display text-4xl font-bold text-rq-orange">{streak}</div>
          <div className="text-sm text-rq-muted">day streak</div>
        </div>
      </div>

      {/* Streak info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between bg-orange-50 rounded-xl px-3 py-2">
          <span className="text-xs text-rq-muted">🏆 Longest Streak</span>
          <span className="text-sm font-bold text-rq-orange">{longestStreak} days</span>
        </div>
        <div className="flex items-center justify-between bg-blue-50 rounded-xl px-3 py-2">
          <span className="text-xs text-rq-muted">🧊 Streak Freezes</span>
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={`text-lg ${i < streakFreeze ? '' : 'opacity-20'}`}>🧊</span>
            ))}
          </div>
        </div>
        <p className="text-[10px] text-rq-muted text-center mt-1">
          Streak freezes protect your streak if you miss a day
        </p>
      </div>
    </div>
  )
}

function DailyQuestsPanel({ quests }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-lg">⭐ Daily Quests</h3>
        <span className="text-xs bg-purple-100 text-rq-purple px-2 py-0.5 rounded-full font-medium">
          {quests.filter(q => q.is_completed).length}/{quests.length}
        </span>
      </div>
      <div className="space-y-3">
        {quests.map((quest) => {
          const pct = Math.min((quest.current_value / quest.target_value) * 100, 100)
          return (
            <div
              key={quest.id}
              className={`rounded-xl p-3 transition-all ${
                quest.is_completed
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-sm font-medium ${quest.is_completed ? 'line-through text-green-600' : 'text-rq-text'}`}>
                  {quest.is_completed && '✅ '}{quest.description}
                </span>
                <span className="text-xs font-bold text-rq-purple">+{quest.xp_reward} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      quest.is_completed
                        ? 'bg-green-400'
                        : 'bg-gradient-to-r from-rq-purple to-rq-teal'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-rq-muted font-medium">
                  {quest.current_value}/{quest.target_value}
                </span>
              </div>
              {quest.coin_reward > 0 && (
                <div className="text-[10px] text-rq-muted mt-1">🪙 +{quest.coin_reward} BookCoins</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeeklyChallengeCard({ challenge }) {
  if (!challenge) return null
  const pct = Math.min((challenge.progress / challenge.total) * 100, 100)
  const daysLeft = Math.max(
    Math.ceil((new Date(challenge.ends_at) - new Date()) / (1000 * 60 * 60 * 24)),
    0
  )

  return (
    <div className="bg-gradient-to-br from-purple-50 to-teal-50 rounded-2xl p-5 border border-purple-100 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display font-semibold text-lg">🏆 Weekly Challenge</h3>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          daysLeft <= 3 ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-rq-purple'
        }`}>
          {daysLeft}d left
        </span>
      </div>

      <div className="font-semibold text-rq-text mb-1">{challenge.title}</div>
      <p className="text-sm text-rq-muted mb-3">{challenge.description}</p>

      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 bg-white/60 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-rq-purple to-rq-teal h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-sm font-bold text-rq-purple">{challenge.progress}/{challenge.total}</span>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <span className="bg-white/70 rounded-full px-3 py-1 font-semibold text-rq-purple">⚡ +{challenge.xp_reward} XP</span>
        {challenge.badge && (
          <span className="bg-white/70 rounded-full px-3 py-1 font-semibold text-rq-orange">
            🏅 {challenge.badge.name} badge
          </span>
        )}
      </div>
    </div>
  )
}
