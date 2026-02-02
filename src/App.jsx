import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Demo from './pages/Demo'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import Pricing from './pages/Pricing'
import BookDetail from './pages/BookDetail'
import Publishers from './pages/Publishers'
import DiscoverByShow from './pages/DiscoverByShow'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const [demoMode, setDemoMode] = useState(null)
  const location = useLocation()
  const isLanding = location.pathname === '/' || location.pathname === ''
  const isPublishers = location.pathname.startsWith('/publishers')
  const isDemoRoute = location.pathname.startsWith('/demo') || location.pathname.startsWith('/student') || location.pathname.startsWith('/teacher') || location.pathname.startsWith('/book') || location.pathname.startsWith('/discover')

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar isDemo={isDemoRoute} demoMode={demoMode} setDemoMode={setDemoMode} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/demo" element={<Demo setDemoMode={setDemoMode} />} />
          <Route path="/student/*" element={<StudentDashboard />} />
          <Route path="/teacher/*" element={<TeacherDashboard />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/publishers" element={<Publishers />} />
          <Route path="/discover" element={<DiscoverByShow />} />
        </Routes>
      </main>
      {(isLanding || isPublishers) && <Footer />}
    </div>
  )
}
