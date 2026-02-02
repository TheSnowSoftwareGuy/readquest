import { Link } from 'react-router-dom'

export default function Demo({ setDemoMode }) {
  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-purple-50 via-white to-teal-50 py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Try the <span className="text-rq-purple">Interactive Demo</span>
        </h1>
        <p className="text-lg text-rq-muted mb-12 max-w-2xl mx-auto">
          Experience ReadQuest from every perspective. Pick a role to explore the platform.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Student */}
          <Link
            to="/student"
            onClick={() => setDemoMode?.('student')}
            className="group bg-white rounded-2xl p-8 border-2 border-purple-100 hover:border-rq-purple shadow-sm hover:shadow-xl hover:shadow-purple-100/50 transition-all hover:-translate-y-2"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-rq-purple to-rq-teal rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform">
              🧑‍🎓
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">I'm a Student</h3>
            <p className="text-rq-muted text-sm mb-4">
              Explore your bookshelf, earn XP & badges, see what friends are reading, and discover your next favorite book.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="bg-purple-100 text-rq-purple text-xs px-3 py-1 rounded-full font-medium">📚 Bookshelf</span>
              <span className="bg-orange-100 text-rq-orange text-xs px-3 py-1 rounded-full font-medium">⚡ XP & Badges</span>
              <span className="bg-teal-100 text-rq-teal text-xs px-3 py-1 rounded-full font-medium">👥 Social</span>
            </div>
            <div className="mt-6 text-rq-purple font-semibold text-sm group-hover:gap-2 transition-all flex items-center justify-center gap-1">
              Enter as Jayden (4th Grade) <span>→</span>
            </div>
          </Link>

          {/* Teacher */}
          <Link
            to="/teacher"
            onClick={() => setDemoMode?.('teacher')}
            className="group bg-white rounded-2xl p-8 border-2 border-teal-100 hover:border-rq-teal shadow-sm hover:shadow-xl hover:shadow-teal-100/50 transition-all hover:-translate-y-2"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-rq-teal to-rq-blue rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform">
              👩‍🏫
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">I'm a Teacher</h3>
            <p className="text-rq-muted text-sm mb-4">
              Manage your class, track reading progress, create challenges, and generate reports for parent conferences.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="bg-teal-100 text-rq-teal text-xs px-3 py-1 rounded-full font-medium">📊 Dashboard</span>
              <span className="bg-blue-100 text-rq-blue text-xs px-3 py-1 rounded-full font-medium">📋 Reports</span>
              <span className="bg-purple-100 text-rq-purple text-xs px-3 py-1 rounded-full font-medium">🏆 Challenges</span>
            </div>
            <div className="mt-6 text-rq-teal font-semibold text-sm group-hover:gap-2 transition-all flex items-center justify-center gap-1">
              Enter as Ms. Rodriguez <span>→</span>
            </div>
          </Link>
        </div>

        {/* Feature callouts */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { icon: '🤖', label: 'AI Recommendations' },
            { icon: '📷', label: 'Barcode Scanner' },
            { icon: '📖', label: '1.5M+ Books' },
            { icon: '🔒', label: 'COPPA Compliant' },
          ].map((item, i) => (
            <div key={i} className="bg-white/80 backdrop-blur rounded-xl p-4 text-center border border-purple-50">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-xs font-semibold text-rq-muted">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
