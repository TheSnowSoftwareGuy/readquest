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
import Login from './pages/Login'
import Signup from './pages/Signup'
import AuthCallback from './pages/AuthCallback'
import TeacherOnboarding from './pages/TeacherOnboarding'
import AuthGuard from './components/AuthGuard'
import MyBookshelf from './pages/MyBookshelf'
import ReadingLog from './pages/ReadingLog'
import Achievements from './pages/Achievements'
import SocialFeed from './pages/SocialFeed'
import TeacherClassView from './pages/TeacherClassView'
import ParentDashboard from './pages/ParentDashboard'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import COPPACompliance from './pages/COPPACompliance'
import FERPACompliance from './pages/FERPACompliance'
import CookiePolicy from './pages/CookiePolicy'
import Leaderboards from './pages/Leaderboards'
import AvatarCustomizer from './pages/AvatarCustomizer'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

/** Routes where Navbar and Footer are hidden (full-screen auth pages) */
const AUTH_ROUTES = ['/login', '/signup', '/auth/callback', '/onboarding']

export default function App() {
  const [demoMode, setDemoMode] = useState(null)
  const location = useLocation()
  const isLanding = location.pathname === '/' || location.pathname === ''
  const isPublishers = location.pathname.startsWith('/publishers')
  const isDemoRoute = location.pathname.startsWith('/demo') || location.pathname.startsWith('/student') || location.pathname.startsWith('/teacher') || location.pathname.startsWith('/book') || location.pathname.startsWith('/discover') || location.pathname.startsWith('/bookshelf') || location.pathname.startsWith('/reading-log') || location.pathname.startsWith('/achievements') || location.pathname.startsWith('/feed') || location.pathname.startsWith('/parent') || location.pathname.startsWith('/leaderboards') || location.pathname.startsWith('/avatar')
  const isLegalPage = location.pathname.startsWith('/privacy') || location.pathname.startsWith('/terms') || location.pathname.startsWith('/coppa') || location.pathname.startsWith('/ferpa') || location.pathname.startsWith('/cookies')
  const isAuthRoute = AUTH_ROUTES.some((r) => location.pathname.startsWith(r))

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {!isAuthRoute && <Navbar isDemo={isDemoRoute} demoMode={demoMode} setDemoMode={setDemoMode} />}
      <main className="flex-1">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/publishers" element={<Publishers />} />

          {/* Auth pages (no navbar/footer) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected: Teacher onboarding */}
          <Route path="/onboarding/teacher" element={
            <AuthGuard allowedRoles={['teacher']}>
              <TeacherOnboarding />
            </AuthGuard>
          } />

          {/* Functional pages (auth or demo) */}
          <Route path="/bookshelf" element={<MyBookshelf />} />
          <Route path="/reading-log" element={<ReadingLog />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/feed" element={<SocialFeed />} />
          <Route path="/teacher/class" element={<TeacherClassView />} />
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/avatar" element={<AvatarCustomizer />} />

          {/* Legal pages (own footer included) */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/coppa" element={<COPPACompliance />} />
          <Route path="/ferpa" element={<FERPACompliance />} />
          <Route path="/cookies" element={<CookiePolicy />} />

          {/* Demo pages (no auth required) */}
          <Route path="/demo" element={<Demo setDemoMode={setDemoMode} />} />
          <Route path="/student/*" element={<StudentDashboard />} />
          <Route path="/teacher/*" element={<TeacherDashboard />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/discover" element={<DiscoverByShow />} />
        </Routes>
      </main>
      {!isAuthRoute && !isLegalPage && (isLanding || isPublishers) && <Footer />}
    </div>
  )
}
