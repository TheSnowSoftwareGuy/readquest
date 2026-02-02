import { useState, useEffect, createContext, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase, getCurrentProfile, isSupabaseConfigured } from '../lib/supabase.ts'

/**
 * Auth context — provides user, profile, and loading state to all children
 */
const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

/**
 * AuthGuard — wraps protected routes.
 *
 * - Checks Supabase auth state on mount + listens for changes
 * - Redirects to /login if not authenticated
 * - Optionally restricts to specific roles
 * - Passes user/profile data to children via context
 *
 * Usage:
 *   <AuthGuard>                            — any authenticated user
 *   <AuthGuard allowedRoles={['teacher']}> — teachers only
 */
export default function AuthGuard({ children, allowedRoles }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If Supabase is not configured, show demo mode notice
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    let mounted = true

    // Check initial session
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          if (mounted) {
            navigate('/login', {
              replace: true,
              state: { from: location.pathname },
            })
          }
          return
        }

        if (mounted) {
          setUser(session.user)
          // Fetch profile
          const profileData = await getCurrentProfile()
          if (mounted) {
            setProfile(profileData)

            // Role check
            if (allowedRoles && profileData && !allowedRoles.includes(profileData.role)) {
              // Redirect to role-appropriate dashboard
              const roleDashboard = {
                teacher: '/teacher',
                parent: '/parent',
                student: '/student',
                admin: '/admin',
              }
              navigate(roleDashboard[profileData.role] || '/', { replace: true })
              return
            }

            setLoading(false)
          }
        }
      } catch (err) {
        console.error('AuthGuard error:', err)
        if (mounted) {
          navigate('/login', { replace: true })
        }
      }
    }

    checkAuth()

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        if (event === 'SIGNED_OUT' || !session) {
          setUser(null)
          setProfile(null)
          navigate('/login', { replace: true })
          return
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(session.user)
          const profileData = await getCurrentProfile()
          if (mounted) {
            setProfile(profileData)
            setLoading(false)
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [navigate, location.pathname, allowedRoles])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  // Demo mode notice when Supabase is not configured
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl shadow-purple-100/50 border border-purple-100 p-8 text-center">
            <div className="text-5xl mb-4">🔧</div>
            <h2 className="font-display text-2xl font-bold mb-2 text-rq-text">
              Supabase Not Configured
            </h2>
            <p className="text-sm text-rq-muted mb-4 leading-relaxed">
              Add <code className="bg-purple-50 px-1.5 py-0.5 rounded text-rq-purple text-xs font-mono">VITE_SUPABASE_URL</code> and{' '}
              <code className="bg-purple-50 px-1.5 py-0.5 rounded text-rq-purple text-xs font-mono">VITE_SUPABASE_ANON_KEY</code> to
              your <code className="bg-purple-50 px-1.5 py-0.5 rounded text-rq-purple text-xs font-mono">.env</code> file to enable authentication.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 text-left text-xs font-mono text-rq-muted mb-6">
              <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
              <div>VITE_SUPABASE_ANON_KEY=your-anon-key</div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-rq-purple to-rq-purple-light text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-purple-200 transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-r from-rq-purple to-rq-teal animate-pulse-glow flex items-center justify-center mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <p className="text-sm text-rq-muted font-medium">Loading your dashboard…</p>
          <div className="mt-4 flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-rq-purple/60 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}
