import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
const logo = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1782036334/nuyo9eosd2rhpesywkt0.png"
import { fadeUp, staggerChildren } from '../motionVariants'
import { API_URL } from '../config'

export default function Account() {
  const { user, logout } = useAuth()
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchInvites = async () => {
      try {
        const response = await fetch(`${API_URL}/api/invites/my`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        })
        if (response.status === 401) {
          logout()
          navigate('/login')
          return
        }
        if (response.ok) {
          const data = await response.json()
          setInvites(data)
        }
      } catch (error) {
        console.error('Error fetching invites:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvites()
  }, [user, navigate, logout])

  if (!user) return null

  return (
    <div className="min-h-screen bg-iqBg font-saas text-iqText">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-iqBorder bg-white/70 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Inviteque" className="h-8 w-auto" />
            <span className="font-parisienne text-3xl font-normal text-iqText leading-none">Inviteque</span>
          </Link>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/')}
              className="text-sm font-semibold text-iqText/60 hover:text-iqText transition-colors"
            >
              ← Back to Home
            </button>
            <button 
              onClick={logout}
              className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 md:py-20">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerChildren}
          className="space-y-12"
        >
          {/* User Profile Summary */}
          <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">My Account</h1>
              <p className="mt-2 text-iqText/60 font-medium">Manage your invitations and purchase history</p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-iqBorder bg-white p-4 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-iqText text-lg font-bold text-white uppercase">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-bold">{user.name}</p>
                <p className="text-xs text-iqText/50">{user.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Invitations Section */}
          <motion.div variants={fadeUp} className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Invitations</h2>
              <span className="rounded-full bg-iqText/5 px-4 py-1.5 text-xs font-bold text-iqText/60">
                {invites.length} {invites.length === 1 ? 'Invitation' : 'Invitations'}
              </span>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-iqBorder bg-white/50">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-iqText border-t-transparent" />
              </div>
            ) : invites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {invites.map((invite) => (
                  <motion.div
                    key={invite.id}
                    whileHover={{ y: -4 }}
                    onClick={() => navigate(`/account/${invite.code}`)}
                    className="cursor-pointer group overflow-hidden rounded-[2rem] border border-iqBorder bg-white p-6 shadow-luxury transition-all hover:border-iqText"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                          {invite.templateId.replace(/-/g, ' ')}
                        </span>
                        <h3 className="text-xl font-bold text-iqText">
                          {invite.coupleData?.groomName} & {invite.coupleData?.brideName}
                        </h3>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider ${
                        invite.status === 'PAID' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {invite.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-medium text-iqText/40 border-t border-iqBorder/50 pt-4">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>
                          {invite.createdAt 
                            ? new Date(invite.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : 'Date TBD'}
                        </span>
                      </div>
                      <span className="group-hover:text-iqText transition-colors font-bold flex items-center gap-1">
                        View Details <span>→</span>
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-iqBorder bg-white/50 py-16 text-center">
                <div className="h-12 w-12 rounded-full bg-iqBg flex items-center justify-center text-2xl opacity-20">📜</div>
                <div className="space-y-1">
                  <p className="font-bold text-iqText">No invitations found</p>
                  <p className="text-sm text-iqText/40">You haven't purchased any templates yet.</p>
                </div>
                <Link to="/#templates" className="mt-4 rounded-full bg-black px-6 py-2 text-xs font-bold text-white shadow-lg transition hover:scale-105">
                  Browse Templates
                </Link>
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
