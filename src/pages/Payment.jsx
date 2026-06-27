import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config'
const logo = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1779029564/g49iwmxbue23d5o6v73o.png"
import { fadeUp } from '../motionVariants'
import { templates } from '../templates/templates'
const themeImg = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1779029551/j3pvwk2eiuvbrxt0m39d.png"

export default function Payment() {
  const location = useLocation()
  const navigate = useNavigate()
  const { draftData, templateId } = location.state || {}
  const { saveInvitation, user, loading: authLoading } = useAuth()

  const [isProcessing, setIsProcessing] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  // Get template details
  const template = templates.find(t => t.id === templateId)

  const TEMPLATE_PRICE = 999 // Price in INR

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-iqBg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user) return null

  if (!draftData || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-iqBg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-iqText">Invalid Payment Session</h1>
          <button
            onClick={() => navigate('/')}
            className="mt-6 rounded-full bg-black px-8 py-3 text-sm font-bold text-white hover:opacity-90"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const isAlreadyPaid = draftData.status === 'PAID'

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      setCouponSuccess('')
      return
    }

    setIsValidatingCoupon(true)
    setCouponError('')
    setCouponSuccess('')

    try {
      const response = await fetch(`${API_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ code: couponCode.trim() })
      })

      if (!response.ok) {
        throw new Error('Failed to validate coupon')
      }

      const data = await response.json()
      if (data.isValid || data.valid) {
        setAppliedCoupon({
          code: data.code,
          discountPercentage: data.discountPercentage
        })
        setCouponSuccess(data.message || 'Coupon applied successfully!')
        setCouponError('')
      } else {
        setAppliedCoupon(null)
        setCouponError(data.message || 'Invalid coupon code.')
        setCouponSuccess('')
      }
    } catch (error) {
      console.error('Coupon validation error:', error)
      setCouponError('Error validating coupon. Please try again.')
      setCouponSuccess('')
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponSuccess('')
    setCouponError('')
  }

  const discount = appliedCoupon ? (TEMPLATE_PRICE * appliedCoupon.discountPercentage) / 100 : 0
  const finalPrice = TEMPLATE_PRICE - discount

  const handlePaymentClick = async () => {
    setIsProcessing(true)
    try {
      // Prepare backend request matching our JSONB columns
      const inviteRequest = {
        code: draftData.code, // VERY IMPORTANT: Pass code to update instead of creating new
        templateId,
        coupleData: {
          groomName: draftData.groomName,
          brideName: draftData.brideName
        },
        heroData: {
          groomName: draftData.groomName,
          brideName: draftData.brideName,
          weddingDate: draftData.weddingDate,
          weddingMonth: draftData.weddingMonth,
          weddingYear: draftData.weddingYear
        },
        venueData: {
          mahalName: draftData.mahalName,
          venueAddress: draftData.venueAddress,
          venueCity: draftData.venueCity,
          state: draftData.state,
          mapLink: draftData.mapLink
        },
        scheduleData: {
          showSchedule: draftData.showSchedule,
          showGallery: draftData.showGallery,
          items: draftData.scheduleItems
        },
        storyData: {
          photos: draftData.photos
        },
        invitationData: {}, // Placeholder
        rsvpData: {}, // Placeholder
        status: 'PAID', // Ensure status is set to PAID after this step
        couponCode: appliedCoupon ? appliedCoupon.code : null
      }

      const savedInvite = await saveInvitation(inviteRequest)
      const inviteUrl = `${window.location.origin}/templates/${templateId}/${savedInvite.code}`

      // If already paid, we don't need a new confirmation, or we can just show success
      navigate('/payment-confirmation', {
        state: {
          orderId: savedInvite.id,
          inviteUrl,
          draftData,
          template,
          amount: isAlreadyPaid ? draftData.amountPaid : finalPrice,
          code: savedInvite.code,
          isUpdate: true
        }
      })
    } catch (error) {
      console.error('Save error:', error)
      alert('Error saving invitation. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-iqBg font-saas text-iqText flex flex-col">
      {/* Header */}
      <header className="border-b border-iqBorder bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Inviteque" className="h-8 w-auto" />
            <span className="text-sm md:text-lg font-bold">{isAlreadyPaid ? 'Update' : 'Payment'}</span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-semibold text-iqText/60 hover:text-iqText transition-colors"
          >
            ← Back
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
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {isAlreadyPaid ? 'Review Your Updates' : 'Order Summary'}
              </h1>
              <p className="text-iqText/60">
                {isAlreadyPaid
                  ? 'Confirm the changes before they go live'
                  : 'Review your invitation details and proceed to payment'}
              </p>
            </div>

            {/* Main Info Card */}
            <motion.div
              variants={fadeUp}
              className="rounded-[2.5rem] border border-iqBorder bg-white overflow-hidden shadow-luxury"
            >
              {/* Template Image / Header */}
              <div className="h-40 md:h-52 overflow-hidden bg-gradient-to-br from-[#5C0A14] via-[#7B0F1A] to-[#5C0A14] relative">
                <img
                  src={themeImg}
                  alt={template.name}
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Template</span>
                    <h2 className="text-2xl font-serif italic mt-1">{template.name}</h2>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-10 space-y-6">
                {/* Couple Summary */}
                <div className="space-y-4 pb-6 border-b border-iqBorder">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-iqText/40 font-bold uppercase tracking-widest text-[10px]">Couple</span>
                    <span className="font-bold text-lg">{draftData.groomName} & {draftData.brideName}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-iqText/40 font-bold uppercase tracking-widest text-[10px]">Date</span>
                    <span className="font-bold">{draftData.weddingDate} {draftData.weddingMonth} {draftData.weddingYear}</span>
                  </div>
                  <div className="flex justify-between items-start text-sm">
                    <span className="text-iqText/40 font-bold uppercase tracking-widest text-[10px]">Venue</span>
                    <span className="font-bold text-right max-w-[200px]">{draftData.mahalName}</span>
                  </div>
                </div>

                {/* Feature Status */}
                <div className="grid grid-cols-2 gap-4 pb-6">
                  <div className="rounded-2xl bg-iqBg/50 p-4 border border-iqBorder">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-iqText/40 block mb-1">Gallery</span>
                    <span className="text-xs font-bold">{draftData.showGallery ? '✅ Enabled' : '❌ Disabled'}</span>
                  </div>
                  <div className="rounded-2xl bg-iqBg/50 p-4 border border-iqBorder">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-iqText/40 block mb-1">Schedule</span>
                    <span className="text-xs font-bold">{draftData.showSchedule ? '✅ Enabled' : '❌ Disabled'}</span>
                  </div>
                </div>

                {/* Coupon Code Input */}
                {!isAlreadyPaid && (
                  <div className="space-y-3 pt-4 border-t border-iqBorder">
                    <span className="text-iqText/40 font-bold uppercase tracking-widest text-[10px]">Have a Coupon?</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={appliedCoupon !== null || isValidatingCoupon}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold border border-iqBorder rounded-xl focus:outline-none focus:ring-2 focus:ring-black disabled:bg-iqBg/50 uppercase"
                      />
                      {appliedCoupon ? (
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors duration-200"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={isValidatingCoupon || !couponCode.trim()}
                          className="px-6 py-2.5 text-sm font-bold text-white bg-black hover:opacity-90 rounded-xl transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                        >
                          {isValidatingCoupon ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            'Apply'
                          )}
                        </button>
                      )}
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-600 font-semibold animate-pulse">❌ {couponError}</p>
                    )}
                    {couponSuccess && (
                      <p className="text-xs text-green-600 font-semibold">🎉 {couponSuccess}</p>
                    )}
                  </div>
                )}

                {/* Price (Only show if not paid) */}
                {!isAlreadyPaid ? (
                  <div className="space-y-3 pt-4">
                    {appliedCoupon ? (
                      <div className="space-y-2 w-full pt-4 border-t border-iqBorder">
                        <div className="flex justify-between items-center text-sm text-iqText/60">
                          <span>Original Amount</span>
                          <span>₹{TEMPLATE_PRICE}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-green-600 font-medium">
                          <span>Discount ({appliedCoupon.discountPercentage}%)</span>
                          <span>-₹{discount}</span>
                        </div>
                        <div className="flex justify-between items-end pt-2 border-t border-dashed border-iqBorder">
                          <span className="font-bold">Total Amount</span>
                          <span className="text-3xl font-bold text-iqText">₹{finalPrice}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-end border-t border-iqBorder pt-6">
                        <span className="font-bold">Total Amount</span>
                        <span className="text-3xl font-bold text-iqText">₹{TEMPLATE_PRICE}</span>
                      </div>
                    )}
                    <p className="text-[10px] text-iqText/40 text-center uppercase tracking-widest font-bold">Inclusive of all taxes</p>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-green-50 p-5 border border-green-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest block">Premium Status</span>
                      <span className="text-sm font-bold text-green-700">All features unlocked</span>
                    </div>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-[10px] font-bold">PAID</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Info Box */}
            <motion.div
              variants={fadeUp}
              className={`rounded-2xl p-6 space-y-3 ${isAlreadyPaid ? 'bg-blue-50 border border-blue-100' : 'bg-iqBg/50 border border-iqBorder'}`}
            >
              <h3 className={`font-bold text-sm ${isAlreadyPaid ? 'text-blue-900' : 'text-iqText'}`}>
                {isAlreadyPaid ? '✨ Free Updates Enabled' : '🎁 What happens next?'}
              </h3>
              <p className={`text-xs leading-relaxed ${isAlreadyPaid ? 'text-blue-800/70' : 'text-iqText/60'}`}>
                {isAlreadyPaid
                  ? 'As a premium user, you can update your wedding details as many times as you like. Your live link will be refreshed instantly once you click update.'
                  : 'After a successful payment, you will receive your unique digital invitation link. You can share this link with your guests instantly via WhatsApp or Email.'}
              </p>
            </motion.div>
          </div>

          {/* Payment Actions */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-iqBorder"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex-1 rounded-full border border-iqBorder bg-white py-4 text-sm font-bold text-iqText transition hover:bg-iqText/5"
            >
              Continue Editing
            </button>
            <button
              onClick={handlePaymentClick}
              disabled={isProcessing}
              className={`flex-1 rounded-full bg-black py-4 text-sm font-bold text-white shadow-xl transition hover:opacity-90 flex items-center justify-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  {isAlreadyPaid ? (
                    <>
                      <span>💾</span>
                      Update Invitation
                    </>
                  ) : (
                    <>
                      <span>💳</span>
                      Pay ₹{finalPrice}
                    </>
                  )}
                </>
              )}
            </button>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-iqBorder bg-white/80 backdrop-blur-md mt-auto">
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
