import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
const logo = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1782036334/nuyo9eosd2rhpesywkt0.png"
export default function PaymentConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  
  const { orderId, inviteUrl, draftData, template, amount, isUpdate } = location.state || {}

  if (!orderId || !inviteUrl) {
    return (
      <div className="min-h-screen flex flex-col bg-iqBg font-saas">
        <header className="border-b border-iqBorder bg-white/70 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Inviteque" className="h-8 w-auto" />
              <span className="text-sm font-bold text-iqText">{isUpdate ? 'Update' : 'Payment'} Confirmation</span>
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-iqText mb-4">Session Expired</h1>
            <button
              onClick={() => navigate('/')}
              className="rounded-full bg-black px-8 py-3 text-sm font-bold text-white hover:opacity-90"
            >
              Back to Home
            </button>
          </div>
        </main>
      </div>
    )
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareWhatsApp = () => {
    const text = `Dear guests, we're thrilled to invite you to our wedding!\n\nView our digital invitation: ${inviteUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="min-h-screen flex flex-col bg-iqBg font-saas">
      {/* Header */}
      <header className="border-b border-iqBorder bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Inviteque" className="h-8 w-auto" />
            <span className="text-sm font-bold text-iqText">{isUpdate ? 'Update' : 'Payment'} Confirmation</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-sm font-semibold text-iqText/60 hover:text-iqText transition-colors"
          >
            ← Home
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-2xl px-6 py-8 md:py-12 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Success Checkmark */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            className="flex justify-center"
          >
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
              <motion.svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <path
                  d="M12 28L24 40L44 16"
                  stroke="#10B981"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </div>
          </motion.div>

          {/* Success Text */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center space-y-2"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-iqText">
              {isUpdate ? 'Invitation Updated!' : 'Payment Successful!'}
            </h1>
            <p className="text-iqText/70">
              {isUpdate ? 'Your changes have been saved' : 'Your invitation link is ready to share'}
            </p>
          </motion.div>

          {/* Couple Congratulation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center text-iqText/60 text-sm"
          >
            Congratulations <span className="font-bold text-iqText">{draftData?.groomName} & {draftData?.brideName}</span>
          </motion.div>

          {/* Invitation Link Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-2xl border border-iqBorder bg-white p-6 md:p-8 space-y-4"
          >
            <label className="text-xs font-bold uppercase tracking-wider text-iqText/60 block">Your Unique Link</label>
            <div className="flex gap-2">
              <input
                readOnly
                value={inviteUrl}
                className="flex-1 rounded-xl border border-iqBorder bg-iqBg/50 px-4 py-3 text-sm font-mono text-iqText/80 outline-none"
              />
              <motion.button
                onClick={handleCopyUrl}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-black text-white hover:opacity-90'
                }`}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </motion.button>
            </div>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="rounded-2xl border border-iqBorder bg-white p-6 md:p-8"
          >
            <div className="space-y-3 text-sm">
              <div className="flex justify-between pb-3 border-b border-iqBorder">
                <span className="text-iqText/60">Order ID</span>
                <span className="font-mono text-iqText">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-iqText/60">Template</span>
                <span className="font-semibold text-iqText">{template?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-iqText/60">Wedding Date</span>
                <span className="font-semibold text-iqText">{draftData?.weddingDate} {draftData?.weddingMonth} {draftData?.weddingYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-iqText/60">Venue</span>
                <span className="font-semibold text-iqText text-right">{draftData?.mahalName || draftData?.venueAddress}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-iqBorder font-bold">
                <span className="text-iqText">Amount Paid</span>
                <span className="text-iqText">₹{amount}</span>
              </div>
            </div>
          </motion.div>

          {/* Share Options */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="space-y-3"
          >
            <label className="text-xs font-bold uppercase tracking-wider text-iqText/60 block">Share With Your Guests</label>
            <motion.button
              onClick={handleShareWhatsApp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-xl border border-iqBorder bg-white p-4 font-semibold text-iqText hover:bg-iqBg/50 transition-colors flex items-center justify-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 2.12.54 4.12 1.5 5.87L0 24l6.35-1.47C9.74 23.34 10.85 23.5 12 23.5c6.63 0 12-5.37 12-12S18.63 0 12 0zm0 21.5c-1.04 0-2.06-.2-3.02-.57l-.22-.08-2.26.52.54-1.94-.12-.19C2.74 17.73 2 15.45 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10z" />
                <path fill="#25D366" d="M16.67 13.75c-.3-.15-1.78-.88-2.05-.98-.27-.1-.46-.15-.65.15-.19.3-.73.98-.89 1.18-.16.2-.33.22-.63.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.33.44-.5.14-.16.19-.27.28-.45.09-.18.05-.34-.04-.48-.09-.13-.65-1.56-.89-2.13-.23-.55-.47-.47-.65-.48h-.56c-.19 0-.5.07-.76.33-.27.27-1.02 1-1.02 2.44s.23 2.83.26 3.03c.03.2 2.42 3.7 5.87 5.18.82.35 1.46.56 1.96.71.82.25 1.56.21 2.15.13.66-.09 2.04-.83 2.33-1.64.29-.81.29-1.5.2-1.64s-.3-.22-.62-.37z" />
              </svg>
              WhatsApp
            </motion.button>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="rounded-xl border border-iqBorder bg-iqBg/50 p-4 md:p-6 space-y-3"
          >
            <h3 className="font-bold text-iqText text-sm">What's Next?</h3>
            <ul className="space-y-2 text-xs md:text-sm text-iqText/70">
              <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>Your invitation link is ready to share with guests</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>A confirmation email will arrive shortly</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>Valid for 6 months from today</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>Edit your invitation anytime from your dashboard</span>
              </li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-3 pt-4"
          >
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 rounded-full border border-iqBorder bg-white py-3 text-sm font-bold text-iqText transition hover:bg-iqText/5"
            >
              Back to Home
            </motion.button>
            <motion.button
              onClick={() => window.open(inviteUrl, '_blank')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 rounded-full bg-black py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              View Invitation
            </motion.button>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
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
