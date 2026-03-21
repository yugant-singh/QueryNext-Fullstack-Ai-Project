import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useSelector, useDispatch } from 'react-redux'
import { setError } from '../auth.slice'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { handleLogin } = useAuth()

  const loading = useSelector(state => state.auth.loading)
  const error = useSelector(state => state.auth.error)
  const user = useSelector(state => state.auth.user)

  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user])

  useEffect(() => {
    return () => dispatch(setError(null))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(setError(null))

    // Frontend validation
    const errors = {}
    if (!email.includes('@') || !email.includes('.')) errors.email = "Valid email address daalo"
    if (password.length < 6) errors.password = "Password kam se kam 6 characters ka hona chahiye"

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    await handleLogin({ email, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">QueryNext</h1>
          <p className="text-gray-400">Welcome back to your AI assistant</p>
        </div>

        {/* Form Container */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-8 backdrop-blur-sm hover:border-gray-600 transition-all duration-300">

          {/* Backend Error */}
          {error && (
            <div className="flex items-start gap-2.5 mb-5 px-4 py-3 rounded-lg"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="2" />
                <path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="text-sm" style={{ color: "#FCA5A5" }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: '' })) }}
                placeholder="you@example.com"
                className={`w-full bg-gray-700 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${fieldErrors.email ? 'border-red-500' : 'border-gray-600'}`}
                required
              />
              {fieldErrors.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span>⚠</span> {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: '' })) }}
                placeholder="••••••••"
                className={`w-full bg-gray-700 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${fieldErrors.password ? 'border-red-500' : 'border-gray-600'}`}
                required
              />
              {fieldErrors.password && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span>⚠</span> {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">or</span>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default Login
