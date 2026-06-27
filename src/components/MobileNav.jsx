import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useDraft } from '../context/DraftContext'

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const { resetDraft } = useDraft()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    navigate('/')
  }

  const handleNavigate = (path) => {
    navigate(path)
    setIsOpen(false)
  }

  const calculateDaysRemaining = (purchaseDate) => {
    if (!purchaseDate) return null
    const purchase = new Date(purchaseDate)
    const expiry = new Date(purchase.getTime() + 180 * 24 * 60 * 60 * 1000) // 6 months
    const today = new Date()
    const remaining = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
    return remaining > 0 ? remaining : 0
  }

  const purchasedInvitations = user?.purchasedInvitations || []

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-lg md:hidden"
        aria-label="Toggle menu"
      >
        <svg
          className="h-6 w-6 text-iqText"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Slide-out Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 top-[65px] z-40 bg-black/30"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="fixed right-0 top-[65px] z-50 h-[calc(100vh-65px)] w-80 overflow-y-auto bg-white shadow-xl"
            >
              <div className="space-y-6 p-6">
                {/* Before Login Navigation */}
                {!user ? (
                  <>
                    <nav className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-iqText/60">
                        Navigation
                      </h3>
                      <a
                        href="#templates"
                        onClick={() => setIsOpen(false)}
                        className="block text-base font-semibold text-iqText/80 hover:text-iqText transition-colors"
                      >
                        Templates
                      </a>
                      <a
                        href="#about"
                        onClick={() => setIsOpen(false)}
                        className="block text-base font-semibold text-iqText/80 hover:text-iqText transition-colors"
                      >
                        How it Works
                      </a>
                      <a
                        href="#pricing"
                        onClick={() => setIsOpen(false)}
                        className="block text-base font-semibold text-iqText/80 hover:text-iqText transition-colors"
                      >
                        Pricing
                      </a>
                      <a
                        href="#faq"
                        onClick={() => setIsOpen(false)}
                        className="block text-base font-semibold text-iqText/80 hover:text-iqText transition-colors"
                      >
                        FAQs
                      </a>
                    </nav>

                    <div className="border-t border-iqBorder pt-6">
                      <button
                        onClick={() => handleNavigate('/login')}
                        className="w-full rounded-full border border-iqBorder bg-iqCard px-4 py-3 text-center font-bold text-iqText transition hover:bg-iqText/5"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => handleNavigate('/signup')}
                        className="mt-3 w-full rounded-full bg-black px-4 py-3 text-center font-bold text-white transition hover:opacity-90"
                      >
                        Create Account
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* User Account Section */}
                    <div className="space-y-3 rounded-xl border border-iqBorder bg-iqBg/50 p-4">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-iqText/60">
                          Account
                        </h3>
                        <p className="mt-2 text-lg font-bold text-iqText">{user.name}</p>
                        <p className="mt-1 text-sm text-iqText/60">{user.email}</p>
                      </div>
                    </div>

                    {/* Purchased Invitations Section */}
                    {purchasedInvitations.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-iqText/60">
                          Your Invitations
                        </h3>
                        {purchasedInvitations.map((inv) => {
                          const daysRemaining = calculateDaysRemaining(inv.purchaseDate)
                          const isExpired = daysRemaining === 0

                          return (
                            <div
                              key={inv.id}
                              className="rounded-lg border border-iqBorder bg-white p-3"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-semibold text-iqText">{inv.templateName}</p>
                                  <p className="mt-1 text-xs text-iqText/60">
                                    {inv.groomName} & {inv.brideName}
                                  </p>
                                </div>
                                <span
                                  className={`flex-shrink-0 rounded-full px-2 py-1 text-xs font-bold ${
                                    isExpired
                                      ? 'bg-red-100 text-red-700'
                                      : daysRemaining <= 30
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-green-100 text-green-700'
                                  }`}
                                >
                                  {isExpired ? 'Expired' : `${daysRemaining}d left`}
                                </span>
                              </div>
                              <div className="mt-3 flex gap-2">
                                <button
                                  onClick={() => handleNavigate(`/templates/${inv.templateId}?preview=true`)}
                                  className="flex-1 rounded-lg border border-iqBorder bg-iqCard px-2 py-2 text-xs font-semibold text-iqText transition hover:bg-iqText/5"
                                >
                                  View
                                </button>
                                {!isExpired && (
                                  <button
                                    onClick={() => handleNavigate(`/builder/${inv.templateId}?edit=${inv.id}`)}
                                    className="flex-1 rounded-lg bg-iqText px-2 py-2 text-xs font-semibold text-iqCard transition hover:opacity-90"
                                  >
                                    Edit
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="space-y-3 border-t border-iqBorder pt-6">
                      <button
                        onClick={() => handleNavigate('/account')}
                        className="w-full rounded-full border border-iqText bg-transparent px-4 py-3 text-center font-bold text-iqText transition hover:bg-iqText/5"
                      >
                        My Account
                      </button>
                      <button
                        onClick={() => {
                          resetDraft()
                          handleNavigate('/builder/template-1')
                        }}
                        className="w-full rounded-full bg-black px-4 py-3 text-center font-bold text-white transition hover:opacity-90"
                      >
                        Create New Invitation
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full rounded-full border border-iqBorder bg-iqCard px-4 py-3 text-center font-bold text-iqText transition hover:bg-iqText/5"
                      >
                        Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
