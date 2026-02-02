import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { demoStudent, bookshelf, sampleBooks, readingLog, socialFeed, challenges, recommendations, leaderboard, badges, weeklyStats, xpForLevel, getLevelInfo } from '../data/mockData'
import { sponsoredBooks } from '../data/placementData'

export default function StudentDashboard() {
  return (
    <Routes>
      <Route index element={<StudentHome />} />
      <Route path="bookshelf" element={<Bookshelf />} />
      <Route path="challenges" element={<Challenges />} />
      <Route path="social" element={<Social />} />
      <Route path="stats" element={<Stats />} />
    </Routes>
  )
}

/* ========== STUDENT HOME ========== */
function StudentHome() {
  const s = demoStudent
  const levelInfo = getLevelInfo(s.level)
  const currentXP = s.xp % xpForLevel(s.level)
  const nextLevelXP = xpForLevel(s.level)
  const progress = Math.min((currentXP / nextLevelXP) * 100, 100)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Welcome back, {s.firstName}! 👋</h1>
        <p className="text-rq-muted">Keep your streak going — you're on fire! 🔥</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="🔥" label="Day Streak" value={s.currentStreak} accent="orange" badge={`Best: ${s.longestStreak}`} />
        <StatCard icon="⚡" label="Total XP" value={s.xp.toLocaleString()} accent="purple" badge={`Lvl ${s.level}`} />
        <StatCard icon="📚" label="Books Read" value={s.booksRead} accent="teal" badge="This year" />
        <StatCard icon="⏱️" label="Minutes Read" value={s.minutesRead.toLocaleString()} accent="blue" badge="All time" />
      </div>

      {/* Level Progress */}
      <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{levelInfo.emoji}</span>
            <div>
              <div className="font-display font-bold text-lg">Level {s.level} — {s.levelName}</div>
              <div className="text-sm text-rq-muted">{250} XP to next level</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-rq-purple">{s.xp.toLocaleString()} XP</div>
            <div className="text-xs text-rq-muted">/ {(s.xp + 250).toLocaleString()} XP</div>
          </div>
        </div>
        <div className="bg-gray-100 rounded-full h-4 overflow-hidden">
          <div className="xp-bar h-full rounded-full transition-all duration-1000" style={{ width: `${92}%` }} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly Goal */}
        <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-4">📈 Weekly Goal Progress</h3>
          <div className="space-y-4">
            <GoalBar label="Reading Time" current={weeklyStats.minutesRead} goal={weeklyStats.minutesGoal} unit="min" color="purple" />
            <GoalBar label="Pages Read" current={weeklyStats.pagesRead} goal={300} unit="pages" color="teal" />
            <GoalBar label="Reviews" current={weeklyStats.reviewsWritten} goal={3} unit="" color="orange" />
          </div>
        </div>

        {/* Currently Reading */}
        <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-4">📖 Currently Reading</h3>
          <div className="space-y-3">
            {bookshelf.reading.map((book, i) => (
              <div key={i} className="flex gap-3 items-center bg-gradient-to-r from-purple-50 to-transparent rounded-xl p-3">
                <img src={book.cover} alt={book.title} className="w-12 h-16 object-cover rounded-lg shadow" onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120"><rect fill="%236C3CE1" width="80" height="120" rx="4"/><text x="40" y="65" text-anchor="middle" fill="white" font-size="30">📖</text></svg>' }} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{book.title}</div>
                  <div className="text-xs text-rq-muted">{book.author}</div>
                  <div className="mt-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-rq-purple to-rq-teal h-full rounded-full" style={{ width: `${30 + i * 35}%` }} />
                  </div>
                </div>
                <span className="text-xs text-rq-muted">{30 + i * 35}%</span>
              </div>
            ))}
          </div>
          <Link to="/student/bookshelf" className="mt-3 inline-block text-sm text-rq-purple font-semibold hover:underline">View full bookshelf →</Link>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg">🤖 Recommended for You</h3>
            <span className="text-xs bg-purple-100 text-rq-purple px-3 py-1 rounded-full font-medium">AI-Powered</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {recommendations.map((book, i) => (
              <BookCard key={i} book={book} reason={book.reason} />
            ))}
          </div>
        </div>

        {/* As Seen On TV */}
        <div className="bg-gradient-to-r from-orange-50 to-purple-50 rounded-2xl p-5 border border-orange-100 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg">📺 Books From Your Favorite Shows</h3>
            <Link to="/discover" className="text-xs bg-white text-rq-orange px-3 py-1 rounded-full font-medium hover:bg-orange-100 transition-colors">Discover More →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {sponsoredBooks.map((book, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all mb-2 bg-gradient-to-br from-purple-100 to-teal-100">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect fill="%236C3CE1" width="200" height="300" rx="8"/><text x="100" y="160" text-anchor="middle" fill="white" font-size="60">📖</text></svg>' }} />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm">
                    {book.seenIn[0] && `📺 ${book.seenIn[0].show}`}
                  </div>
                </div>
                <div className="text-xs font-semibold truncate">{book.title}</div>
                <div className="text-[10px] text-rq-muted truncate">{book.author}</div>
                <div className="text-[10px] text-rq-orange mt-0.5 truncate">{book.sponsorLabel}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Feed */}
        <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-4">👥 Friend Activity</h3>
          <div className="space-y-3">
            {socialFeed.slice(0, 4).map((event) => (
              <FeedItem key={event.id} event={event} />
            ))}
          </div>
          <Link to="/student/social" className="mt-3 inline-block text-sm text-rq-purple font-semibold hover:underline">See all activity →</Link>
        </div>

        {/* Active Challenges */}
        <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-4">🏆 Active Challenges</h3>
          <div className="space-y-3">
            {challenges.slice(0, 3).map((ch) => (
              <ChallengeCard key={ch.id} challenge={ch} />
            ))}
          </div>
          <Link to="/student/challenges" className="mt-3 inline-block text-sm text-rq-purple font-semibold hover:underline">View all challenges →</Link>
        </div>
      </div>
    </div>
  )
}

/* ========== BOOKSHELF ========== */
function Bookshelf() {
  const [activeShelf, setActiveShelf] = useState('reading')
  const shelves = { reading: bookshelf.reading, finished: bookshelf.finished, wantToRead: bookshelf.wantToRead }
  const labels = { reading: '📖 Reading Now', finished: '✅ Finished', wantToRead: '📋 Want to Read' }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="font-display text-3xl font-bold mb-2">My Bookshelf 📚</h1>
      <p className="text-rq-muted mb-6">Organize your reading journey</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.entries(labels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveShelf(key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeShelf === key
                ? 'bg-gradient-to-r from-rq-purple to-rq-purple-light text-white shadow-md'
                : 'bg-white text-rq-muted border border-purple-100 hover:border-rq-purple/30'
            }`}
          >
            {label} ({shelves[key].length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {shelves[activeShelf].map((book, i) => (
          <div key={i} className="bg-white rounded-xl border border-purple-50 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer">
            <div className="aspect-[2/3] bg-gradient-to-br from-purple-100 to-teal-100 overflow-hidden">
              <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect fill="%236C3CE1" width="200" height="300" rx="8"/><text x="100" y="160" text-anchor="middle" fill="white" font-size="60">📖</text></svg>' }} />
            </div>
            <div className="p-3">
              <div className="font-semibold text-sm truncate">{book.title}</div>
              <div className="text-xs text-rq-muted truncate">{book.author}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-xs text-rq-muted">{book.rating}</span>
                <span className="text-xs text-rq-muted ml-1">{book.lexile}</span>
              </div>
            </div>
          </div>
        ))}
        {/* Add Book Card */}
        <div className="bg-white rounded-xl border-2 border-dashed border-purple-200 flex flex-col items-center justify-center min-h-[250px] hover:border-rq-purple hover:bg-purple-50/50 transition-all cursor-pointer group">
          <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">➕</span>
          <span className="text-sm font-semibold text-rq-purple">Add Book</span>
          <span className="text-xs text-rq-muted">Scan or search</span>
        </div>
      </div>
    </div>
  )
}

/* ========== CHALLENGES ========== */
function Challenges() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="font-display text-3xl font-bold mb-2">Challenges 🏆</h1>
      <p className="text-rq-muted mb-6">Complete challenges to earn XP and special badges!</p>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {challenges.map((ch) => (
          <div key={ch.id} className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-display font-semibold text-lg">{ch.title}</div>
                <div className="text-xs text-rq-muted">by {ch.creator} · Ends {ch.endDate}</div>
              </div>
              <span className="bg-gradient-to-r from-rq-purple to-rq-teal text-white text-xs px-3 py-1 rounded-full font-bold">+{ch.xpReward} XP</span>
            </div>
            <p className="text-sm text-rq-muted mb-3">{ch.description}</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-rq-purple to-rq-teal h-full rounded-full transition-all" style={{ width: `${(ch.progress / ch.total) * 100}%` }} />
              </div>
              <span className="text-sm font-bold text-rq-purple">{ch.progress}/{ch.total}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <h2 className="font-display text-2xl font-bold mb-4">🏅 Class Leaderboard</h2>
      <div className="bg-white rounded-2xl border border-purple-50 shadow-sm overflow-hidden">
        <div className="divide-y divide-purple-50">
          {leaderboard.map((entry, i) => (
            <div key={i} className={`flex items-center gap-4 p-4 ${i < 3 ? 'bg-gradient-to-r from-yellow-50/50 to-transparent' : ''} ${entry.name === 'Jayden M.' ? 'bg-purple-50/50 border-l-4 border-rq-purple' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i === 0 ? 'bg-yellow-400 text-white' : i === 1 ? 'bg-gray-300 text-white' : i === 2 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-rq-muted'
              }`}>
                {i + 1}
              </div>
              <span className="text-2xl">{entry.avatar}</span>
              <div className="flex-1">
                <div className="font-semibold text-sm">{entry.name} {entry.name === 'Jayden M.' && <span className="text-xs text-rq-purple">(You)</span>}</div>
                <div className="text-xs text-rq-muted">{entry.books} books · {entry.school}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm text-rq-purple">{entry.xp.toLocaleString()} XP</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ========== SOCIAL ========== */
function Social() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="font-display text-3xl font-bold mb-2">Friend Activity 👥</h1>
      <p className="text-rq-muted mb-6">See what your friends are reading</p>

      <div className="space-y-4">
        {socialFeed.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{event.avatar}</span>
              <div className="flex-1">
                <div className="mb-1">
                  <span className="font-semibold">{event.user}</span>
                  <span className="text-rq-muted"> {event.action} </span>
                  {event.book && <span className="font-semibold text-rq-purple">{event.book}</span>}
                  {event.badge && <span className="font-semibold text-rq-orange">{event.badge}</span>}
                  {event.challenge && <span className="font-semibold text-rq-teal">{event.challenge}</span>}
                  {event.level && <span className="font-semibold text-rq-purple">{event.level}</span>}
                </div>
                {event.review && (
                  <div className="bg-purple-50 rounded-xl p-3 mt-2 text-sm text-rq-text">
                    {event.emoji && <div className="mb-1 text-yellow-400">{event.emoji}</div>}
                    "{event.review}"
                  </div>
                )}
                {event.emoji && !event.review && <div className="text-yellow-400 text-sm">{event.emoji}</div>}
                <div className="text-xs text-rq-muted mt-2">{event.time}</div>
                <div className="flex gap-3 mt-2">
                  <button className="text-xs text-rq-muted hover:text-rq-purple transition-colors">❤️ Like</button>
                  <button className="text-xs text-rq-muted hover:text-rq-purple transition-colors">💬 Comment</button>
                  <button className="text-xs text-rq-muted hover:text-rq-purple transition-colors">📚 Add to Shelf</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ========== STATS ========== */
function Stats() {
  const s = demoStudent
  const maxMin = Math.max(...readingLog.map(r => r.minutes))

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="font-display text-3xl font-bold mb-2">My Stats 📊</h1>
      <p className="text-rq-muted mb-6">Your reading journey at a glance</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="📚" label="Books Read" value={s.booksRead} accent="purple" />
        <StatCard icon="⏱️" label="Total Minutes" value={s.minutesRead.toLocaleString()} accent="teal" />
        <StatCard icon="✍️" label="Reviews" value={s.reviewsWritten} accent="orange" />
        <StatCard icon="🔥" label="Best Streak" value={`${s.longestStreak} days`} accent="pink" />
      </div>

      {/* Reading Chart */}
      <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm mb-6">
        <h3 className="font-display font-semibold text-lg mb-4">📈 Reading Activity (Last 14 Days)</h3>
        <div className="flex items-end gap-2 h-40">
          {readingLog.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-gradient-to-t from-rq-purple to-rq-teal rounded-t-md transition-all hover:opacity-80 cursor-pointer group relative" style={{ height: `${(day.minutes / maxMin) * 100}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-rq-text text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {day.minutes} min
                </div>
              </div>
              <div className="text-[10px] text-rq-muted">{day.date.split('-')[2]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Reading Level */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-4">📐 Reading Level</h3>
          <div className="space-y-3">
            {[
              { label: 'Lexile', value: s.readingLevel.lexile, color: 'purple' },
              { label: 'AR Level', value: s.readingLevel.ar, color: 'teal' },
              { label: 'Guided Reading', value: s.readingLevel.guidedReading, color: 'blue' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <span className="text-sm text-rq-muted">{item.label}</span>
                <span className={`font-bold text-rq-${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-4">🏅 My Badges ({s.badges.length})</h3>
          <div className="grid grid-cols-4 gap-3">
            {badges.filter(b => s.badges.includes(b.id)).map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center group cursor-pointer">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-1 group-hover:scale-110 transition-transform" style={{ backgroundColor: badge.color + '20' }}>
                  {badge.icon}
                </div>
                <div className="text-[10px] font-semibold truncate w-full">{badge.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Genre Distribution */}
      <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
        <h3 className="font-display font-semibold text-lg mb-4">📊 Genre Distribution</h3>
        <div className="flex gap-4 flex-wrap">
          {[
            { genre: 'Fantasy', count: 8, color: '#6C3CE1' },
            { genre: 'Adventure', count: 6, color: '#14B8A6' },
            { genre: 'Science Fiction', count: 4, color: '#3B82F6' },
            { genre: 'Mystery', count: 3, color: '#F97316' },
            { genre: 'Humor', count: 2, color: '#EC4899' },
          ].map((g, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: g.color }} />
              <span className="text-sm">{g.genre}</span>
              <span className="text-sm font-bold text-rq-muted">({g.count})</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex h-6 rounded-full overflow-hidden">
          <div className="bg-rq-purple" style={{ width: '35%' }} />
          <div className="bg-rq-teal" style={{ width: '26%' }} />
          <div className="bg-rq-blue" style={{ width: '17%' }} />
          <div className="bg-rq-orange" style={{ width: '13%' }} />
          <div className="bg-rq-pink" style={{ width: '9%' }} />
        </div>
      </div>
    </div>
  )
}

/* ========== SHARED COMPONENTS ========== */
function StatCard({ icon, label, value, accent, badge }) {
  const accents = {
    purple: 'from-purple-100 to-purple-50 border-purple-100',
    teal: 'from-teal-100 to-teal-50 border-teal-100',
    orange: 'from-orange-100 to-orange-50 border-orange-100',
    blue: 'from-blue-100 to-blue-50 border-blue-100',
    pink: 'from-pink-100 to-pink-50 border-pink-100',
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

function GoalBar({ label, current, goal, unit, color }) {
  const pct = Math.min((current / goal) * 100, 100)
  const colors = { purple: 'from-rq-purple to-rq-purple-light', teal: 'from-rq-teal to-rq-teal-light', orange: 'from-rq-orange to-rq-yellow' }
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-rq-muted">{label}</span>
        <span className="font-semibold">{current}/{goal} {unit}</span>
      </div>
      <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
        <div className={`bg-gradient-to-r ${colors[color]} h-full rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function BookCard({ book, reason }) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all mb-2 bg-gradient-to-br from-purple-100 to-teal-100">
        <img src={book.cover} alt={book.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect fill="%236C3CE1" width="200" height="300" rx="8"/><text x="100" y="160" text-anchor="middle" fill="white" font-size="60">📖</text></svg>' }} />
      </div>
      <div className="text-xs font-semibold truncate">{book.title}</div>
      <div className="text-[10px] text-rq-muted truncate">{book.author}</div>
      {reason && <div className="text-[10px] text-rq-purple mt-0.5 truncate">✨ {reason}</div>}
    </div>
  )
}

function FeedItem({ event }) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-purple-50/50 transition-colors">
      <span className="text-2xl">{event.avatar}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm">
          <span className="font-semibold">{event.user}</span>
          <span className="text-rq-muted"> {event.action} </span>
          {event.book && <span className="font-semibold text-rq-purple">{event.book}</span>}
          {event.badge && <span className="font-semibold text-rq-orange">{event.badge}</span>}
          {event.challenge && <span className="font-semibold text-rq-teal">{event.challenge}</span>}
          {event.level && <span className="font-semibold text-rq-purple">{event.level}</span>}
        </div>
        <div className="text-xs text-rq-muted">{event.time}</div>
      </div>
    </div>
  )
}

function ChallengeCard({ challenge }) {
  const pct = (challenge.progress / challenge.total) * 100
  return (
    <div className="bg-gradient-to-r from-purple-50 to-transparent rounded-xl p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-sm">{challenge.title}</span>
        <span className="text-xs text-rq-purple font-bold">+{challenge.xpReward} XP</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-rq-purple to-rq-teal h-full rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs text-rq-muted">{challenge.progress}/{challenge.total}</span>
      </div>
    </div>
  )
}
