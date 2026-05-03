import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-zinc-100 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 font-['Lora',serif]">

      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full -top-32 -left-32 w-96 h-96 bg-amber-100/60 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-rose-100/50 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm sm:max-w-md">

        {/* Card */}
        <div className="px-6 py-10 border shadow-xl bg-white/80 backdrop-blur-md rounded-3xl shadow-stone-200/80 border-stone-100 sm:px-10 sm:py-12">

          {/* Logo / Brand mark */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center justify-center w-12 h-12 shadow-md rounded-2xl bg-gradient-to-br from-amber-400 to-rose-400 shadow-amber-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl text-stone-800">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-stone-400 font-['DM_Sans',sans-serif] tracking-wide">
              Sign in to continue to your account
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl font-['DM_Sans',sans-serif]">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} className="space-y-5 font-['DM_Sans',sans-serif]">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold tracking-widest uppercase text-stone-500">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 text-sm transition duration-200 border rounded-xl border-stone-200 bg-stone-50/60 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold tracking-widest uppercase text-stone-500">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium transition-colors text-amber-500 hover:text-amber-600"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 pl-10 text-sm transition duration-200 border pr-11 rounded-xl border-stone-200 bg-stone-50/60 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-500 hover:to-rose-500 text-white text-sm font-semibold tracking-wide shadow-md shadow-amber-200/60 hover:shadow-lg hover:shadow-amber-200/80 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-stone-100" />
            <span className="text-xs text-stone-300 font-['DM_Sans',sans-serif]">or</span>
            <div className="flex-1 h-px bg-stone-100" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-stone-400 font-['DM_Sans',sans-serif]">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-semibold transition-colors text-amber-500 rgb(10, 31, 68)"
            >
              Register
            </button>
          </p>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 font-['DM_Sans',sans-serif] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Home
          </button>
        </div>

      </div>
    </div>
  )
}

export default Login