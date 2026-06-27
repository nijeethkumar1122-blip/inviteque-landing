import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
const logo = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1782036334/nuyo9eosd2rhpesywkt0.png"
import { fadeUp } from '../motionVariants'
import { API_URL } from '../config'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const result = await login(email, password)
    
    if (result.success) {
      window.location.href = '/'
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-iqBg font-saas">
      <header className="border-b border-iqBorder bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Inviteque" className="h-8 w-auto" loading="lazy" />
            <span className="font-parisienne text-2xl font-normal text-iqText leading-none">Inviteque</span>
          </Link>
          <Link to="/signup" className="text-sm font-semibold text-iqText/60 hover:text-iqText">
            Create account
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <motion.div 
          initial="hidden" 
          animate="show" 
          variants={fadeUp}
          className="w-full max-w-md space-y-8 rounded-[2rem] border border-iqBorder bg-white p-10 shadow-luxury"
        >
        <div className="text-center">
          <Link to="/">
            <img src={logo} alt="Inviteque" className="mx-auto h-8 w-auto" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-iqText">Welcome Back</h2>
          <p className="mt-2 text-sm text-iqText/50">Login to your account</p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-iqText/40">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-iqBorder bg-iqBg/50 px-4 py-3 text-sm outline-none focus:border-iqText transition-colors"
                placeholder="rohan@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-iqText/40">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-iqBorder bg-iqBg/50 px-4 py-3 text-sm outline-none focus:border-iqText transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-full bg-black px-4 py-4 text-sm font-bold text-white shadow-xl transition hover:opacity-90 active:scale-95"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-iqBorder"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-iqText/30">Or continue with</span></div>
        </div>

        <button 
          onClick={() => window.location.href = `${API_URL}/oauth2/authorization/google`}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-iqBorder bg-white px-4 py-3 text-sm font-semibold transition hover:bg-iqBg"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Google
        </button>

        <p className="text-center text-sm text-iqText/50">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-iqText hover:underline">Sign up</Link>
        </p>
        </motion.div>
      </main>

      <footer className="border-t border-iqBorder bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Inviteque" className="h-6 w-auto" loading="lazy" />
            <span className="font-parisienne text-xl font-normal text-iqText leading-none">Inviteque</span>
          </div>
          <span className="text-xs font-medium text-iqText/40">© {new Date().getFullYear()} Inviteque</span>
        </div>
      </footer>
    </div>
  )
}
