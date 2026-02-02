import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp, signInWithGoogle } from '../lib/supabase.ts'

export default function Signup() {
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('teacher')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    // Validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!acceptTerms) {
      setError('Please accept the Terms of Service and Privacy Policy.')
      return
    }

    setLoading(true)
    try {
      const { data, error: authError } = await signUp(email, password, {
        display_name: displayName,
        role,
      })
      if (authError) throw authError

      setSuccess(true)
      // If email confirmation is disabled, redirect immediately
      if (data?.session) {
        navigate(role === 'teacher' ? '/onboarding/teacher' : '/parent')
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSSO() {
    setError(null)
    try {
      const { error: authError } = await signInWithGoogle()
      if (authError) throw authError
    } catch (err) {
      setError(err.message || 'Google sign-up failed. Please try again.')
    }
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl shadow-purple-100/50 border border-purple-100 p-8 text-center animate-slide-up">
            <div className="text-6xl mb-4">📬</div>
            <h2 className="font-display text-2xl font-bold mb-2">Check Your Email!</h2>
            <p className="text-rq-muted text-sm mb-6 leading-relaxed">
              We've sent a confirmation link to <strong className="text-rq-text">{email}</strong>.
              Click the link to verify your account and start your ReadQuest journey!
            </p>
            <div className="bg-purple-50 rounded-xl p-4 text-sm text-rq-muted">
              <p className="font-semibold text-rq-text mb-1">Didn't get the email?</p>
              <p>Check your spam folder, or <button className="text-rq-purple font-semibold hover:underline">resend confirmation</button>.</p>
            </div>
            <Link
              to="/login"
              className="inline-block mt-6 text-sm font-semibold text-rq-purple hover:text-rq-purple-dark transition-colors"
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/5 right-1/6 text-6xl opacity-10 animate-float">🚀</div>
        <div className="absolute bottom-1/3 left-1/6 text-5xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>📖</div>
        <div className="absolute top-2/3 right-1/3 text-5xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>🌟</div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">📚</span>
            <span className="font-display font-bold text-2xl text-rq-purple">ReadQuest</span>
          </Link>
          <h1 className="font-display text-3xl font-bold mt-4 mb-2">
            Start Your <span className="bg-gradient-to-r from-rq-purple to-rq-teal bg-clip-text text-transparent">Adventure</span>
          </h1>
          <p className="text-rq-muted text-sm">Create your free account and transform reading</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-purple-100/50 border border-purple-100 p-8">
          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-rq-text mb-2">I am a…</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  role === 'teacher'
                    ? 'bg-gradient-to-r from-rq-purple to-rq-purple-light text-white shadow-lg shadow-purple-200'
                    : 'bg-purple-50 text-rq-muted hover:bg-purple-100'
                }`}
              >
                <span className="block text-xl mb-0.5">👩‍🏫</span>
                Teacher
              </button>
              <button
                type="button"
                onClick={() => setRole('parent')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  role === 'parent'
                    ? 'bg-gradient-to-r from-rq-teal to-rq-teal-light text-white shadow-lg shadow-teal-200'
                    : 'bg-teal-50 text-rq-muted hover:bg-teal-100'
                }`}
              >
                <span className="block text-xl mb-0.5">👨‍👩‍👧</span>
                Parent
              </button>
            </div>
            <p className="text-xs text-rq-muted mt-2">
              {role === 'teacher'
                ? '✨ Teachers can create classes and manage students.'
                : '✨ Parents can monitor their children\'s reading progress.'}
            </p>
          </div>

          {/* Google SSO */}
          <button
            type="button"
            onClick={handleGoogleSSO}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-3 text-sm font-semibold text-rq-text hover:border-rq-purple/40 hover:shadow-md transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-rq-muted">or create an account</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm animate-slide-up">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-semibold text-rq-text mb-1.5">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={role === 'teacher' ? 'Ms. Rodriguez' : 'Jane Smith'}
                className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-rq-purple focus:ring-2 focus:ring-purple-200 outline-none text-sm transition-all placeholder:text-gray-300"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-rq-text mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'teacher' ? 'you@school.edu' : 'parent@email.com'}
                className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-rq-purple focus:ring-2 focus:ring-purple-200 outline-none text-sm transition-all placeholder:text-gray-300"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-rq-text mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-rq-purple focus:ring-2 focus:ring-purple-200 outline-none text-sm transition-all placeholder:text-gray-300"
              />
              {password.length > 0 && (
                <div className="mt-1.5 flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length >= level * 3
                          ? level <= 1
                            ? 'bg-red-400'
                            : level <= 2
                            ? 'bg-orange-400'
                            : level <= 3
                            ? 'bg-yellow-400'
                            : 'bg-green-400'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-rq-text mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none text-sm transition-all placeholder:text-gray-300 ${
                  confirmPassword && confirmPassword !== password
                    ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200'
                    : 'border-purple-100 focus:border-rq-purple focus:ring-2 focus:ring-purple-200'
                }`}
              />
              {confirmPassword && confirmPassword !== password && (
                <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-purple-300 text-rq-purple focus:ring-rq-purple"
              />
              <span className="text-xs text-rq-muted leading-relaxed">
                I agree to the{' '}
                <a href="/terms" className="text-rq-purple font-medium hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-rq-purple font-medium hover:underline">Privacy Policy</a>.
                {role === 'parent' && (
                  <> I consent to my child's use of ReadQuest per <a href="/coppa" className="text-rq-purple font-medium hover:underline">COPPA guidelines</a>.</>
                )}
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !acceptTerms}
              className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all ${
                role === 'teacher'
                  ? 'bg-gradient-to-r from-rq-purple to-rq-purple-light text-white hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5'
                  : 'bg-gradient-to-r from-rq-teal to-rq-teal-light text-white hover:shadow-xl hover:shadow-teal-200 hover:-translate-y-0.5'
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none`}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </span>
              ) : (
                `Create ${role === 'teacher' ? 'Teacher' : 'Parent'} Account`
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-rq-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-rq-purple hover:text-rq-purple-dark transition-colors">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
