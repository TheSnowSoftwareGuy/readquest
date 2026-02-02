import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.ts'

/**
 * AuthCallback — handles OAuth redirect from providers (Google).
 * Supabase JS automatically exchanges the URL hash for a session.
 * This page shows a loading state while that happens, then redirects
 * based on the user's role.
 */
export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    async function handleCallback() {
      try {
        // Supabase detects the access_token / refresh_token in the URL hash
        // and sets the session automatically (detectSessionInUrl: true)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) throw sessionError
        if (!session) {
          throw new Error('No session found. Please try signing in again.')
        }

        // Fetch user profile to determine role and redirect
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, onboarding_completed')
          .eq('id', session.user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 = row not found (new user, profile not yet created by trigger)
          console.warn('Profile fetch error:', profileError)
        }

        const role = profile?.role || session.user.user_metadata?.role || 'teacher'
        const onboardingDone = profile?.onboarding_completed ?? false

        // Route based on role
        if (role === 'teacher' && !onboardingDone) {
          navigate('/onboarding/teacher', { replace: true })
        } else if (role === 'teacher') {
          navigate('/teacher', { replace: true })
        } else if (role === 'parent') {
          navigate('/parent', { replace: true })
        } else {
          navigate('/student', { replace: true })
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setError(err.message)
      }
    }

    handleCallback()
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl shadow-purple-100/50 border border-purple-100 p-8 text-center">
            <div className="text-5xl mb-4">😕</div>
            <h2 className="font-display text-2xl font-bold mb-2 text-rq-text">Something Went Wrong</h2>
            <p className="text-sm text-rq-muted mb-6">{error}</p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="bg-gradient-to-r from-rq-purple to-rq-purple-light text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-purple-200 transition-all"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Animated loading */}
        <div className="relative mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-rq-purple to-rq-teal animate-pulse-glow flex items-center justify-center">
            <span className="text-3xl animate-float">📚</span>
          </div>
        </div>
        <h2 className="font-display text-2xl font-bold text-rq-text mb-2">
          Setting Up Your Adventure…
        </h2>
        <p className="text-sm text-rq-muted">
          Hang tight while we prepare your account!
        </p>
        <div className="mt-6 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-rq-purple animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
