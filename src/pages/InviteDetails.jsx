import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
const logo = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1779029564/g49iwmxbue23d5o6v73o.png"
import { fadeUp } from '../motionVariants'
const themeImg = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1779029551/j3pvwk2eiuvbrxt0m39d.png"
import { API_URL } from '../config'

export default function InviteDetails() {
  const { code } = useParams()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [invite, setInvite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchInvite = async () => {
      try {
        const response = await fetch(`${API_URL}/api/invites/${code}`, {
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
          setInvite(data)
        } else {
          navigate('/account')
        }
      } catch (error) {
        console.error('Error fetching invite details:', error)
        navigate('/account')
      } finally {
        setLoading(false)
      }
    }

    fetchInvite()
  }, [code, user, navigate, logout])

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/templates/${invite.templateId}/${invite.code}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareWhatsApp = () => {
    const url = `${window.location.origin}/templates/${invite.templateId}/${invite.code}`
    const text = `Dear guests, we're thrilled to invite you to our wedding!\n\nView our digital invitation: ${url}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-iqBg">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-iqText border-t-transparent" />
      </div>
    )
  }

  if (!invite) return null

  const inviteUrl = `${window.location.origin}/templates/${invite.templateId}/${invite.code}`

  return (
    <div className="min-h-screen flex flex-col bg-iqBg font-saas">
      {/* Header */}
      <header className="border-b border-iqBorder bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Inviteque" className="h-8 w-auto" />
            <span className="text-sm font-bold text-iqText">Invitation Details</span>
          </div>
          <button
            onClick={() => navigate('/account')}
            className="text-sm font-semibold text-iqText/60 hover:text-iqText transition-colors"
          >
            ← Back to Account
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-2xl px-6 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Summary Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-iqText">
              {invite.coupleData?.groomName} & {invite.coupleData?.brideName}
            </h1>
            <p className="text-iqText/50 font-medium">
              Created on {new Date(invite.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Main Card (Styled like Payment Confirmation) */}
          <motion.div
            variants={fadeUp}
            className="rounded-[2.5rem] border border-iqBorder bg-white overflow-hidden shadow-luxury"
          >
            {/* Visual Header */}
            <div className="h-48 md:h-64 overflow-hidden bg-gradient-to-br from-[#5C0A14] via-[#7B0F1A] to-[#5C0A14] relative">
              <img 
                src={themeImg}
                alt={invite.templateId}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-70">Template</span>
                  <h2 className="text-2xl font-serif italic mt-1 capitalize">{invite.templateId.replace(/-/g, ' ')}</h2>
                </div>
              </div>
              <div className="absolute top-6 right-6">
                <span className={`rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md text-white border border-white/30`}>
                  {invite.status}
                </span>
              </div>
            </div>

            <div className="p-8 md:p-10 space-y-8">
              {/* Live Link Section */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-iqText/40 block">Live Invitation Link</label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 p-2 sm:p-1.5 rounded-3xl border border-iqBorder bg-iqBg/30">
                  <input
                    readOnly
                    value={inviteUrl}
                    className="flex-1 bg-transparent px-4 py-3 sm:py-2 text-[11px] sm:text-sm font-mono text-iqText/70 outline-none truncate"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className={`rounded-2xl sm:rounded-xl px-5 py-3 sm:py-2.5 text-xs font-bold transition-all shadow-sm active:scale-95 ${
                      copied ? 'bg-green-500 text-white' : 'bg-black text-white'
                    }`}
                  >
                    {copied ? '✓ Copied URL' : 'Copy Invitation Link'}
                  </button>
                </div>
              </div>

              {/* Event Details Grid */}
              <div className="grid grid-cols-2 gap-8 py-8 border-y border-iqBorder">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-iqText/40">Date</span>
                  <p className="font-bold">{invite.heroData?.weddingDate} {invite.heroData?.weddingMonth} {invite.heroData?.weddingYear}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-iqText/40">Venue</span>
                  <p className="font-bold truncate">{invite.venueData?.mahalName || invite.venueData?.venueCity}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-iqText/40">Gallery</span>
                  <p className="font-bold">{invite.scheduleData?.showGallery ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-iqText/40">Schedule</span>
                  <p className="font-bold">{invite.scheduleData?.showSchedule ? `${invite.scheduleData.items?.length || 0} Events` : 'Disabled'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => navigate(`/builder/${invite.templateId}?code=${invite.code}`)}
                  className="flex-1 rounded-full border border-iqBorder py-4 text-sm font-bold text-iqText transition hover:bg-iqText hover:text-white shadow-sm hover:shadow-lg"
                >
                  Edit Details
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="flex-1 rounded-full bg-black py-4 text-sm font-bold text-white shadow-xl transition hover:opacity-90 flex items-center justify-center gap-3"
                >
                  <span>Share on WhatsApp</span>
                </button>
              </div>

              <div className="flex justify-center">
                <Link 
                  to={`/templates/${invite.templateId}/${invite.code}`}
                  target="_blank"
                  className="text-xs font-bold text-iqText/40 hover:text-iqText hover:underline transition-all"
                >
                  View Live Invitation
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
