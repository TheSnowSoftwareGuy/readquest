import { Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import { classStudents, challenges, demoTeacher } from '../data/mockData'

export default function TeacherDashboard() {
  return (
    <Routes>
      <Route index element={<TeacherHome />} />
      <Route path="students" element={<Students />} />
      <Route path="challenges" element={<TeacherChallenges />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  )
}

function TeacherHome() {
  const t = demoTeacher
  const cls = t.classes[0]
  const exceeding = classStudents.filter(s => s.status === 'exceeding').length
  const onTrack = classStudents.filter(s => s.status === 'on-track').length
  const needsSupport = classStudents.filter(s => s.status === 'needs-support').length
  const totalMinutes = classStudents.reduce((a, s) => a + s.minutesWeek, 0)
  const avgBooks = (classStudents.reduce((a, s) => a + s.booksRead, 0) / classStudents.length).toFixed(1)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Teacher Dashboard 📊</h1>
        <p className="text-rq-muted">{t.firstName} · {cls.name} · {cls.students} students</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <QuickStat label="Students" value={cls.students} icon="👥" color="purple" />
        <QuickStat label="Avg Books/Mo" value={avgBooks} icon="📚" color="teal" />
        <QuickStat label="Total Min/Wk" value={totalMinutes.toLocaleString()} icon="⏱️" color="blue" />
        <QuickStat label="Exceeding" value={exceeding} icon="🌟" color="green" />
        <QuickStat label="Need Support" value={needsSupport} icon="⚠️" color="red" />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Class Health */}
        <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-4">🏥 Class Health</h3>
          <div className="space-y-3">
            <HealthBar label="Exceeding Goals" count={exceeding} total={classStudents.length} color="green" />
            <HealthBar label="On Track" count={onTrack} total={classStudents.length} color="blue" />
            <HealthBar label="Needs Support" count={needsSupport} total={classStudents.length} color="red" />
          </div>
          <div className="mt-4 flex h-5 rounded-full overflow-hidden">
            <div className="bg-green-400" style={{ width: `${(exceeding / classStudents.length) * 100}%` }} />
            <div className="bg-blue-400" style={{ width: `${(onTrack / classStudents.length) * 100}%` }} />
            <div className="bg-red-400" style={{ width: `${(needsSupport / classStudents.length) * 100}%` }} />
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-4">🔔 Alerts</h3>
          <div className="space-y-3">
            <Alert type="warning" message="Olivia P. has 0 minutes logged this week" />
            <Alert type="warning" message="Liam D. is 60% below reading goal" />
            <Alert type="success" message="Ava C. completed 'Fantasy February' challenge!" />
            <Alert type="info" message="3 new book reviews pending moderation" />
          </div>
        </div>

        {/* Active Challenges */}
        <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
          <h3 className="font-display font-semibold text-lg mb-4">🏆 Active Challenges</h3>
          <div className="space-y-3">
            {challenges.filter(c => c.creator === 'Ms. Rodriguez').map(ch => (
              <div key={ch.id} className="bg-gradient-to-r from-purple-50 to-transparent rounded-xl p-3">
                <div className="font-semibold text-sm">{ch.title}</div>
                <div className="text-xs text-rq-muted">{ch.description}</div>
                <div className="text-xs text-rq-purple mt-1">Ends {ch.endDate}</div>
              </div>
            ))}
            <button className="w-full border-2 border-dashed border-purple-200 rounded-xl p-3 text-sm text-rq-purple font-semibold hover:bg-purple-50 transition-colors">
              + Create New Challenge
            </button>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-purple-50 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-purple-50 flex items-center justify-between">
          <h3 className="font-display font-semibold text-lg">👥 Student Overview</h3>
          <div className="flex gap-2">
            <button className="text-xs bg-purple-100 text-rq-purple px-3 py-1.5 rounded-full font-medium hover:bg-purple-200 transition-colors">Export CSV</button>
            <button className="text-xs bg-teal-100 text-rq-teal px-3 py-1.5 rounded-full font-medium hover:bg-teal-200 transition-colors">Export PDF</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-rq-muted uppercase">
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Books</th>
                <th className="px-5 py-3">Min/Week</th>
                <th className="px-5 py-3">Streak</th>
                <th className="px-5 py-3">Level</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {classStudents.map((student) => (
                <tr key={student.id} className="hover:bg-purple-50/30 transition-colors cursor-pointer">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{student.avatar}</span>
                      <span className="font-semibold text-sm">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm">{student.booksRead}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-2">
                        <div className={`h-full rounded-full ${student.minutesWeek >= 150 ? 'bg-green-400' : student.minutesWeek >= 100 ? 'bg-blue-400' : 'bg-red-400'}`} style={{ width: `${Math.min((student.minutesWeek / 200) * 100, 100)}%` }} />
                      </div>
                      <span className="text-xs text-rq-muted">{student.minutesWeek}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm">{student.streak > 0 ? `🔥 ${student.streak}` : '—'}</td>
                  <td className="px-5 py-3 text-sm font-medium text-rq-purple">Lv {student.level}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={student.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Students() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="font-display text-3xl font-bold mb-2">Students 👥</h1>
      <p className="text-rq-muted mb-6">Manage your class roster and view individual student details</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{student.avatar}</span>
              <div>
                <div className="font-display font-semibold">{student.name}</div>
                <StatusBadge status={student.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <MiniStat label="Books" value={student.booksRead} />
              <MiniStat label="Min/Wk" value={student.minutesWeek} />
              <MiniStat label="Streak" value={student.streak > 0 ? `🔥 ${student.streak}` : '—'} />
              <MiniStat label="Level" value={`Lv ${student.level}`} />
            </div>
            <div className="mt-3">
              <div className="text-xs text-rq-muted mb-1">XP Progress</div>
              <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="xp-bar h-full rounded-full" style={{ width: `${(student.xp % 500) / 5}%` }} />
              </div>
              <div className="text-xs text-rq-muted mt-1">{student.xp.toLocaleString()} XP</div>
            </div>
          </div>
        ))}
        {/* Add Student */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-purple-200 flex flex-col items-center justify-center min-h-[200px] hover:border-rq-purple hover:bg-purple-50/50 transition-all cursor-pointer">
          <span className="text-4xl mb-2">➕</span>
          <span className="text-sm font-semibold text-rq-purple">Add Student</span>
          <span className="text-xs text-rq-muted">Import or invite</span>
        </div>
      </div>
    </div>
  )
}

function TeacherChallenges() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Challenges 🏆</h1>
          <p className="text-rq-muted">Create and manage reading challenges for your class</p>
        </div>
        <button className="bg-gradient-to-r from-rq-purple to-rq-purple-light text-white px-5 py-2.5 rounded-full text-sm font-bold hover:shadow-lg transition-all">
          + New Challenge
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {challenges.map((ch) => (
          <div key={ch.id} className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-display font-semibold text-lg">{ch.title}</div>
                <div className="text-xs text-rq-muted">Created by {ch.creator} · Ends {ch.endDate}</div>
              </div>
              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">Active</span>
            </div>
            <p className="text-sm text-rq-muted mb-3">{ch.description}</p>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center bg-purple-50 rounded-lg p-2">
                <div className="text-lg font-bold text-rq-purple">{Math.floor(Math.random() * 15) + 10}</div>
                <div className="text-[10px] text-rq-muted">Participants</div>
              </div>
              <div className="text-center bg-teal-50 rounded-lg p-2">
                <div className="text-lg font-bold text-rq-teal">{Math.floor(Math.random() * 8) + 2}</div>
                <div className="text-[10px] text-rq-muted">Completed</div>
              </div>
              <div className="text-center bg-orange-50 rounded-lg p-2">
                <div className="text-lg font-bold text-rq-orange">+{ch.xpReward}</div>
                <div className="text-[10px] text-rq-muted">XP Reward</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 text-xs bg-purple-100 text-rq-purple px-3 py-2 rounded-full font-medium hover:bg-purple-200 transition-colors">Edit</button>
              <button className="flex-1 text-xs bg-gray-100 text-rq-muted px-3 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors">View Results</button>
            </div>
          </div>
        ))}
      </div>

      {/* Challenge Templates */}
      <h2 className="font-display text-2xl font-bold mt-10 mb-4">📋 Challenge Templates</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: 'Genre Bingo', icon: '🎯', desc: 'Students read books from different genres to fill their bingo card' },
          { title: 'Reading Marathon', icon: '🏃', desc: 'Class goal to reach X total minutes of reading together' },
          { title: 'Book Review Challenge', icon: '✍️', desc: 'Write thoughtful reviews — quality over quantity' },
          { title: 'Around the World', icon: '🌍', desc: 'Read books set in different countries and continents' },
          { title: 'Author Study', icon: '👤', desc: 'Deep dive into one author — read 3+ books by them' },
          { title: 'Buddy Read', icon: '🤝', desc: 'Pair students to read the same book and discuss' },
        ].map((template, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-purple-50 hover:border-rq-purple/30 hover:shadow-md transition-all cursor-pointer group">
            <span className="text-3xl group-hover:scale-110 transition-transform inline-block">{template.icon}</span>
            <div className="font-semibold text-sm mt-2">{template.title}</div>
            <div className="text-xs text-rq-muted mt-1">{template.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Reports() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="font-display text-3xl font-bold mb-2">Reports 📋</h1>
      <p className="text-rq-muted mb-6">Generate and export reading data for conferences and administration</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[
          { title: 'Class Reading Summary', icon: '📊', desc: 'Overview of class reading metrics — books, minutes, goals', format: 'PDF' },
          { title: 'Student Individual Report', icon: '👤', desc: 'Detailed per-student report for parent conferences', format: 'PDF' },
          { title: 'Goal Completion Report', icon: '🎯', desc: 'Which students met their weekly/monthly goals', format: 'CSV' },
          { title: 'Challenge Results', icon: '🏆', desc: 'Challenge participation and completion data', format: 'CSV' },
          { title: 'Reading Level Growth', icon: '📈', desc: 'Track Lexile/AR level changes over time', format: 'PDF' },
          { title: 'Engagement Report', icon: '💡', desc: 'Login frequency, session length, feature usage', format: 'PDF' },
        ].map((report, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{report.icon}</span>
              <span className="text-xs bg-gray-100 text-rq-muted px-2 py-1 rounded font-mono">{report.format}</span>
            </div>
            <div className="font-display font-semibold mb-1">{report.title}</div>
            <div className="text-sm text-rq-muted mb-4">{report.desc}</div>
            <button className="w-full bg-gradient-to-r from-rq-purple to-rq-purple-light text-white text-sm font-bold py-2 rounded-full hover:shadow-md transition-all">
              Generate Report
            </button>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <h2 className="font-display text-2xl font-bold mb-4">📁 Recent Reports</h2>
      <div className="bg-white rounded-2xl border border-purple-50 shadow-sm overflow-hidden">
        <div className="divide-y divide-purple-50">
          {[
            { name: 'Class Reading Summary — January 2026', date: 'Jan 31, 2026', format: 'PDF', size: '2.4 MB' },
            { name: 'Student Individual Reports — Q4 2025', date: 'Jan 15, 2026', format: 'PDF', size: '8.1 MB' },
            { name: 'Goal Completion — Week of Jan 20', date: 'Jan 27, 2026', format: 'CSV', size: '124 KB' },
          ].map((report, i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-purple-50/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-xl">{report.format === 'PDF' ? '📕' : '📗'}</span>
                <div>
                  <div className="font-semibold text-sm">{report.name}</div>
                  <div className="text-xs text-rq-muted">{report.date} · {report.size}</div>
                </div>
              </div>
              <button className="text-xs text-rq-purple font-semibold hover:underline">Download</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ========== SHARED COMPONENTS ========== */
function QuickStat({ label, value, icon, color }) {
  const colors = {
    purple: 'from-purple-100 to-purple-50 border-purple-100',
    teal: 'from-teal-100 to-teal-50 border-teal-100',
    blue: 'from-blue-100 to-blue-50 border-blue-100',
    green: 'from-green-100 to-green-50 border-green-100',
    red: 'from-red-100 to-red-50 border-red-100',
  }
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-4 border`}>
      <span className="text-2xl">{icon}</span>
      <div className="font-display text-2xl font-bold mt-1">{value}</div>
      <div className="text-xs text-rq-muted">{label}</div>
    </div>
  )
}

function HealthBar({ label, count, total, color }) {
  const pct = (count / total) * 100
  const colors = { green: 'bg-green-400', blue: 'bg-blue-400', red: 'bg-red-400' }
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-rq-muted w-28">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div className={`${colors[color]} h-full rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-bold w-6 text-right">{count}</span>
    </div>
  )
}

function Alert({ type, message }) {
  const styles = {
    warning: 'bg-orange-50 border-orange-200 text-orange-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
  }
  const icons = { warning: '⚠️', success: '✨', info: 'ℹ️' }
  return (
    <div className={`${styles[type]} border rounded-lg p-3 text-xs`}>
      <span className="mr-1">{icons[type]}</span>
      {message}
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    'exceeding': 'bg-green-100 text-green-700',
    'on-track': 'bg-blue-100 text-blue-700',
    'needs-support': 'bg-red-100 text-red-700',
  }
  const labels = {
    'exceeding': '🌟 Exceeding',
    'on-track': '✅ On Track',
    'needs-support': '⚠️ Needs Support',
  }
  return (
    <span className={`${styles[status]} text-xs px-2 py-0.5 rounded-full font-medium`}>
      {labels[status]}
    </span>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-2 text-center">
      <div className="text-sm font-bold">{value}</div>
      <div className="text-[10px] text-rq-muted">{label}</div>
    </div>
  )
}
