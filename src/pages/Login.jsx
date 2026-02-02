import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn, signInWithGoogle } from '../lib/supabase.ts'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('teacher')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error: authError } = await signIn(email, password)
      if (authError) throw authError
      // Redirect based on role (profile.role will be checked by AuthGuard)
      navigate(role === 'teacher' ? '/teacher' : '/parent')
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSSO() {
    setError(null)
    try {
      const { error: authError } = await signInWithGoogle()
      if (authError) throw authError
      // Supabase will redirect to /auth/callback
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/6 text-6xl opacity-10 animate-float">📚</div>
        <div className="absolute bottom-1/4 right-1/6 text-5xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>⭐</div>
        <div className="absolute top-1/3 right-1/4 text-5xl opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>🏆</div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">📚</span>
            <span className="font-display font-bold text-2xl text-rq-purple">ReadQuest</span>
          </Link>
          <h1 className="font-display text-3xl font-bold mt-4 mb-2">
            Welcome <span className="bg-gradient-to-r from-rq-purple to-rq-teal bg-clip-text text-transparent">Back</span>
          </h1>
          <p className="text-rq-muted text-sm">Sign in to continue your reading adventure</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-purple-100/50 border border-purple-100 p-8">
          {/* Role Selector */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                role === 'teacher'
                  ? 'bg-gradient-to-r from-rq-purple to-rq-purple-light text-white shadow-lg shadow-purple-200'
                  : 'bg-purple-50 text-rq-muted hover:bg-purple-100'
              }`}
            >
              👩‍🏫 Teacher
            </button>
            <button
              type="button"
              onClick={() => setRole('parent')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                role === 'parent'
                  ? 'bg-gradient-to-r from-rq-teal to-rq-teal-light text-white shadow-lg shadow-teal-200'
                  : 'bg-teal-50 text-rq-muted hover:bg-teal-100'
              }`}
            >
              👨‍👩‍👧 Parent
            </button>
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
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-rq-muted">or sign in with email</span>
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
              <label htmlFor="email" className="block text-sm font-semibold text-rq-text mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-rq-purple focus:ring-2 focus:ring-purple-200 outline-none text-sm transition-all placeholder:text-gray-300"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-rq-text">
                  Password
                </label>
                <Link to="/auth/reset" className="text-xs text-rq-purple hover:text-rq-purple-dark font-medium">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-rq-purple focus:ring-2 focus:ring-purple-200 outline-none text-sm transition-all placeholder:text-gray-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
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
                  Signing in…
                </span>
              ) : (
                `Sign In as ${role === 'teacher' ? 'Teacher' : 'Parent'}`
              )}
            </button>
          </form>
        </div>

        {/* Footer links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-rq-muted">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-rq-purple hover:text-rq-purple-dark transition-colors">
              Sign up free →
            </Link>
          </p>
          <p className="text-xs text-rq-muted">
            Student?{' '}
            <Link to="/student/login" className="font-medium text-rq-teal hover:text-rq-teal-light transition-colors">
              Sign in with class code
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
