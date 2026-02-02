import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar({ isDemo, demoMode, setDemoMode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isStudent = location.pathname.startsWith('/student') || location.pathname.startsWith('/discover')
  const isTeacher = location.pathname.startsWith('/teacher')

  if (isStudent) {
    return (
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/student" className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span className="font-display font-bold text-xl text-rq-purple">ReadQuest</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/student" label="Home" icon="🏠" />
            <NavLink to="/student/bookshelf" label="My Shelf" icon="📖" />
            <NavLink to="/student/challenges" label="Challenges" icon="🏆" />
            <NavLink to="/discover" label="Shows" icon="📺" />
            <NavLink to="/student/social" label="Friends" icon="👥" />
            <NavLink to="/student/stats" label="Stats" icon="📊" />
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-100 to-teal-100 rounded-full px-3 py-1.5">
              <span className="text-sm font-bold text-rq-purple">🔥 14</span>
              <span className="text-xs text-rq-muted">streak</span>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full px-3 py-1.5">
              <span className="text-sm font-bold text-rq-orange">⚡ 2,750</span>
              <span className="text-xs text-rq-muted">XP</span>
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-rq-purple to-rq-teal rounded-full flex items-center justify-center text-white text-lg cursor-pointer">
              🧑‍🎓
            </div>
            <Link to="/" className="text-xs text-rq-muted hover:text-rq-purple ml-2">Exit Demo</Link>
          </div>
          {/* Mobile nav */}
          <button className="md:hidden ml-2 text-2xl" onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-purple-100 px-4 py-3 flex flex-col gap-2">
            <NavLink to="/student" label="Home" icon="🏠" mobile onClick={() => setMobileOpen(false)} />
            <NavLink to="/student/bookshelf" label="My Shelf" icon="📖" mobile onClick={() => setMobileOpen(false)} />
            <NavLink to="/student/challenges" label="Challenges" icon="🏆" mobile onClick={() => setMobileOpen(false)} />
            <NavLink to="/discover" label="Shows" icon="📺" mobile onClick={() => setMobileOpen(false)} />
            <NavLink to="/student/social" label="Friends" icon="👥" mobile onClick={() => setMobileOpen(false)} />
            <NavLink to="/student/stats" label="Stats" icon="📊" mobile onClick={() => setMobileOpen(false)} />
          </div>
        )}
      </nav>
    )
  }

  if (isTeacher) {
    return (
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/teacher" className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span className="font-display font-bold text-xl text-rq-purple">ReadQuest</span>
            <span className="text-xs bg-rq-teal text-white rounded-full px-2 py-0.5 font-semibold">Teacher</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/teacher" label="Dashboard" icon="📊" />
            <NavLink to="/teacher/students" label="Students" icon="👥" />
            <NavLink to="/teacher/challenges" label="Challenges" icon="🏆" />
            <NavLink to="/teacher/reports" label="Reports" icon="📋" />
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-sm text-rq-muted">Ms. Rodriguez</span>
            <div className="w-9 h-9 bg-gradient-to-br from-rq-teal to-rq-blue rounded-full flex items-center justify-center text-white text-lg">
              👩‍🏫
            </div>
            <Link to="/" className="text-xs text-rq-muted hover:text-rq-purple ml-2">Exit Demo</Link>
          </div>
        </div>
      </nav>
    )
  }

  // Default landing navbar
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-100/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <span className="font-display font-bold text-xl text-rq-purple">ReadQuest</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-rq-muted hover:text-rq-purple transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-rq-muted hover:text-rq-purple transition-colors">How It Works</a>
          <a href="#testimonials" className="text-sm font-medium text-rq-muted hover:text-rq-purple transition-colors">Testimonials</a>
          <Link to="/pricing" className="text-sm font-medium text-rq-muted hover:text-rq-purple transition-colors">Pricing</Link>
          <Link to="/publishers" className="text-sm font-medium text-rq-orange hover:text-rq-orange/80 transition-colors">For Publishers</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/demo" className="hidden md:inline-block text-sm font-semibold text-rq-purple hover:text-rq-purple-dark transition-colors">
            Try Demo
          </Link>
          <Link to="/demo" className="bg-gradient-to-r from-rq-purple to-rq-purple-light text-white px-5 py-2 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-purple-200 transition-all hover:-translate-y-0.5">
            Get Started Free
          </Link>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ to, label, icon, mobile, onClick }) {
  const location = useLocation()
  const isActive = location.pathname === to
  
  if (mobile) {
    return (
      <Link to={to} onClick={onClick} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-purple-100 text-rq-purple' : 'text-rq-muted hover:bg-purple-50'}`}>
        <span>{icon}</span>
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <Link to={to} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive ? 'text-rq-purple' : 'text-rq-muted hover:text-rq-purple'}`}>
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}
