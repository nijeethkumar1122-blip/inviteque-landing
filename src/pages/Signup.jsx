import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
const logo = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1782036334/nuyo9eosd2rhpesywkt0.png"
import { fadeUp } from '../motionVariants'

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })
  const [error, setError] = useState('')
  const { signup } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const result = await signup(formData.name, formData.email, formData.password, formData.phone)
    
    if (result.success) {
      window.location.href = '/'
    } else {
      setError(result.message)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="flex min-h-screen flex-col bg-iqBg font-saas">
      <header className="border-b border-iqBorder bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Inviteque" className="h-8 w-auto" loading="lazy" />
            <span className="font-parisienne text-2xl font-normal text-iqText leading-none">Inviteque</span>
          </Link>
          <Link to="/login" className="text-sm font-semibold text-iqText/60 hover:text-iqText">
            Sign in
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <motion.div 
          initial="hidden" 
          animate="show" 
          variants={fadeUp}
          className="w-full max-w-md space-y-6 rounded-[2rem] border border-iqBorder bg-white p-10 shadow-luxury"
        >
        <div className="text-center">
          <Link to="/">
            <img src={logo} alt="Inviteque" className="mx-auto h-8 w-auto" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-iqText">Create Account</h2>
          <p className="mt-2 text-sm text-iqText/50">Start crafting your cinematic invitations</p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-iqText/40">Full Name</label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-iqBorder bg-iqBg/50 px-4 py-3 text-sm outline-none focus:border-iqText transition-colors"
              placeholder="Rohan Sharma"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-iqText/40">Email</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border border-iqBorder bg-iqBg/50 px-4 py-3 text-sm outline-none focus:border-iqText transition-colors"
                placeholder="rohan@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-iqText/40">Phone</label>
              <input
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border border-iqBorder bg-iqBg/50 px-4 py-3 text-sm outline-none focus:border-iqText transition-colors"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-iqText/40">Password</label>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-iqBorder bg-iqBg/50 px-4 py-3 text-sm outline-none focus:border-iqText transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="flex w-full justify-center rounded-full bg-black px-4 py-4 text-sm font-bold text-white shadow-xl transition hover:opacity-90 active:scale-95"
            >
              Get Started
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-iqText/50">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-iqText hover:underline">Sign in</Link>
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
