import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
const logo = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1782036334/nuyo9eosd2rhpesywkt0.png"
import { useDraft } from '../context/DraftContext'
import { templates } from '../templates/templates'
import { uploadToCloudinary } from '../utils/cloudinary'
import { API_URL } from '../config'
import { useAuth } from '../context/AuthContext'


// Function to format text to proper case (first letter capital, rest lowercase)
function toProperCase(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Function to convert date input (YYYY-MM-DD) to day, month, year
function parseDateInput(dateString) {
  if (!dateString) return { day: '', month: '', year: '' }
  const date = new Date(dateString)
  if (isNaN(date)) return { day: '', month: '', year: '' }

  const day = String(date.getDate())
  const month = date.toLocaleString('en-US', { month: 'long' })
  const year = String(date.getFullYear())
  return { day, month, year }
}

// Function to convert day, month, year to date input format (YYYY-MM-DD)
function formatToDateInput(day, month, year) {
  if (!day || !month || !year) return ''
  const monthIndex = new Date(`${month} 1`).getMonth()
  const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return dateStr
}

// Function to get today's date in YYYY-MM-DD format (local time)
function getTodayDateString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Function to parse HH:MM AM/PM time into separate parts
function parseTimeParts(timeString) {
  const defaultParts = { hours: '', minutes: '', ampm: 'AM' }
  if (!timeString) return defaultParts
  
  const trimmed = timeString.trim().toUpperCase()
  const ampm = trimmed.includes('PM') ? 'PM' : 'AM'
  
  const groups = trimmed.match(/\d+/g)
  if (groups && groups.length >= 1) {
    const hours = groups[0] || ''
    const minutes = groups[1] || ''
    return { hours, minutes, ampm }
  }
  
  return defaultParts
}

export default function Builder() {
  const { templateId } = useParams()
  const [searchParams] = useSearchParams()
  const editCode = searchParams.get('code')
  const navigate = useNavigate()
  const { draftData, updateDraft, resetDraft } = useDraft()
  const [step, setStep] = useState(1)
  const [showMapTooltip, setShowMapTooltip] = useState(false)
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(!!editCode && !draftData.code)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  const defaultFormData = {
    groomName: '',
    brideName: '',
    weddingDate: '',
    weddingMonth: '',
    weddingYear: '',
    mahalName: '',
    venueAddress: '',
    venueCity: '',
    state: '',
    mapLink: '',
    showGallery: true,
    showSchedule: true,
    photos: [null, null, null],
    scheduleItems: [
      { time: '11:00 AM', title: 'Haldi Ceremony' },
      { time: '04:00 PM', title: 'Wedding Vows' },
      { time: '07:00 PM', title: 'Grand Reception' }
    ],
    code: null,
    status: 'DRAFT',
    amountPaid: 0
  }

  // If entering a creation flow (no editCode) but context has a PAID invitation, we must reset
  const shouldStartFresh = !editCode && draftData.status === 'PAID'

  // Initialize with draft data
  const [formData, setFormData] = useState(() => {
    if (shouldStartFresh) {
      return defaultFormData
    }
    return {
      ...draftData,
      groomName: draftData.groomName || '',
      brideName: draftData.brideName || '',
      weddingDate: draftData.weddingDate || '',
      weddingMonth: draftData.weddingMonth || '',
      weddingYear: draftData.weddingYear || '',
      mahalName: draftData.mahalName || '',
      venueAddress: draftData.venueAddress || '',
      venueCity: draftData.venueCity || '',
      state: draftData.state || '',
      mapLink: draftData.mapLink || '',
      showGallery: draftData.showGallery !== undefined ? draftData.showGallery : true,
      showSchedule: draftData.showSchedule !== undefined ? draftData.showSchedule : true,
      photos: draftData.photos || [null, null, null],
      scheduleItems: draftData.scheduleItems || [
        { time: '11:00 AM', title: 'Haldi Ceremony' },
        { time: '04:00 PM', title: 'Wedding Vows' },
        { time: '07:00 PM', title: 'Grand Reception' }
      ],
      code: editCode || draftData.code || null,
      status: draftData.status || 'DRAFT',
      amountPaid: draftData.amountPaid || 0
    }
  })

  useEffect(() => {
    if (shouldStartFresh) {
      resetDraft()
    }
  }, [shouldStartFresh, resetDraft])

  useEffect(() => {
    // If we have an editCode in the URL AND (we haven't loaded it yet OR it's different from what's in memory)
    if (editCode && (draftData.code !== editCode)) {
      setTimeout(() => setLoading(true), 0)
      // Fetch existing data for editing
      fetch(`${API_URL}/api/invites/${editCode}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            const mappedData = {
              groomName: data.coupleData?.groomName || '',
              brideName: data.coupleData?.brideName || '',
              weddingDate: data.heroData?.weddingDate || '',
              weddingMonth: data.heroData?.weddingMonth || '',
              weddingYear: data.heroData?.weddingYear || '',
              mahalName: data.venueData?.mahalName || '',
              venueAddress: data.venueData?.venueAddress || '',
              venueCity: data.venueData?.venueCity || '',
              state: data.venueData?.state || '',
              mapLink: data.venueData?.mapLink || '',
              showGallery: data.scheduleData?.showGallery !== undefined ? data.scheduleData?.showGallery : true,
              showSchedule: data.scheduleData?.showSchedule !== undefined ? data.scheduleData?.showSchedule : true,
              photos: data.storyData?.photos || [null, null, null],
              scheduleItems: data.scheduleData?.items || [
                { time: '11:00 AM', title: 'Haldi Ceremony' },
                { time: '04:00 PM', title: 'Wedding Vows' },
                { time: '07:00 PM', title: 'Grand Reception' }
              ],
              code: data.code,
              status: data.status,
              amountPaid: data.amountPaid || 0
            }
            setFormData(mappedData)
            updateDraft(mappedData)
          }
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching invite for edit:', err)
          setLoading(false)
        })
    }
  }, [editCode, draftData.code, updateDraft])

  const [errors, setErrors] = useState({})
  const [uploadingPhotos, setUploadingPhotos] = useState({ 0: false, 1: false, 2: false })

  // Get template details
  const template = templates.find(t => t.id === templateId)

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent"></div>
      </div>
    )
  }

  if (!user) return null

  const validateStep1 = () => {
    const newErrors = {}

    if (!formData.groomName?.trim()) newErrors.groomName = 'Groom\'s name is required'
    if (!formData.brideName?.trim()) newErrors.brideName = 'Bride\'s name is required'
    if (!formData.weddingDate?.trim()) newErrors.weddingDate = 'Day is required'
    if (!formData.weddingMonth?.trim()) newErrors.weddingMonth = 'Month is required'
    if (!formData.weddingYear?.trim()) newErrors.weddingYear = 'Year is required'
    if (!formData.mahalName?.trim()) newErrors.mahalName = 'Place of wedding is required'
    if (!formData.venueAddress?.trim()) newErrors.venueAddress = 'Venue address is required'
    if (!formData.state?.trim()) newErrors.state = 'State is required'
    if (!formData.mapLink?.trim()) newErrors.mapLink = 'Google Maps link is required'

    // Verify selected date is not in the past
    if (formData.weddingDate && formData.weddingMonth && formData.weddingYear) {
      const selectedDateStr = formatToDateInput(formData.weddingDate, formData.weddingMonth, formData.weddingYear)
      const todayStr = getTodayDateString()
      if (selectedDateStr < todayStr) {
        newErrors.weddingDate = 'Wedding date cannot be in the past'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) {
      return
    }
    nextStep()
  }

  const handleFileChange = async (index, e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setUploadingPhotos(prev => ({ ...prev, [index]: true }))

    try {
      const result = await uploadToCloudinary(file)
      if (result && result.url) {
        const newPhotos = [...(formData.photos || [null, null, null])]
        newPhotos[index] = result.url
        setFormData(prev => ({ ...prev, photos: newPhotos }))
      }
    } catch (err) {
      console.error('Error uploading photo:', err)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploadingPhotos(prev => ({ ...prev, [index]: false }))
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    let finalValue = type === 'checkbox' ? checked : value

    // Apply proper case to couple names
    if ((name === 'groomName' || name === 'brideName') && type !== 'checkbox') {
      finalValue = toProperCase(value)
    }

    // Handle date input separately
    if (name === 'weddingDateInput' && type !== 'checkbox') {
      const { day, month, year } = parseDateInput(value)
      setFormData(prev => ({
        ...prev,
        weddingDate: day,
        weddingMonth: month,
        weddingYear: year
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: finalValue
      }))
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleScheduleChange = (index, field, value) => {
    const newItems = [...formData.scheduleItems]
    newItems[index][field] = value
    setFormData({ ...formData, scheduleItems: newItems })
  }

  const handleAddScheduleItem = () => {
    setFormData(prev => ({
      ...prev,
      scheduleItems: [...prev.scheduleItems, { time: '', title: '' }]
    }))
  }

  const handleDeleteScheduleItem = (index) => {
    // Prevent deleting mandatory first three events
    if (index < 3) return
    setFormData(prev => ({
      ...prev,
      scheduleItems: prev.scheduleItems.filter((_, i) => i !== index)
    }))
  }

  const handleRemovePhoto = (index) => {
    const newPhotos = [...(formData.photos || [])]
    newPhotos[index] = null
    setFormData(prev => ({ ...prev, photos: newPhotos }))
  }

  const nextStep = () => {
    setStep(s => s + 1)
    window.scrollTo(0, 0)
  }
  const prevStep = () => {
    setStep(s => s - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateDraft(formData)
    window.scrollTo(0, 0)
    navigate(`/templates/${templateId}?preview=true`)
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-saas text-iqText flex flex-col">
      {/* Header */}
      <header className="border-b border-iqBorder bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 min-w-0">
            <img src={logo} alt="Inviteque" className="h-8 w-auto flex-shrink-0" />
            <span className="text-sm md:text-lg font-bold hidden sm:inline">Builder</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm font-medium overflow-x-auto">
            <span className={step >= 1 ? 'text-iqText' : 'text-iqText/30'}>Details</span>
            <div className="h-px w-2 md:w-4 bg-iqText/20 flex-shrink-0" />
            <span className={step >= 2 ? 'text-iqText' : 'text-iqText/30'}>Personalize</span>
            <div className="h-px w-2 md:w-4 bg-iqText/20 flex-shrink-0" />
            <span className={step >= 3 ? 'text-iqText' : 'text-iqText/30'}>Review</span>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-2xl px-6 py-8 md:py-12">
        <form onSubmit={handleSubmit} className="space-y-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gold">Step 01</span>
                  <h2 className="text-2xl md:text-3xl font-bold">Essential Details</h2>
                  <p className="text-sm md:text-base text-iqText/60">These details are mandatory for your {template?.name || 'invitation'}.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50">Groom's Name <span className="text-red-500">*</span></label>
                    <input
                      name="groomName"
                      value={formData.groomName}
                      onChange={handleChange}
                      placeholder="Enter groom's name"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${errors.groomName
                        ? 'border-red-500 bg-red-50 focus:border-red-500'
                        : 'border-iqBorder bg-white focus:border-iqText'
                        }`}
                    />
                    {errors.groomName && <p className="text-xs text-red-500">{errors.groomName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50">Bride's Name <span className="text-red-500">*</span></label>
                    <input
                      name="brideName"
                      value={formData.brideName}
                      onChange={handleChange}
                      placeholder="Enter bride's name"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${errors.brideName
                        ? 'border-red-500 bg-red-50 focus:border-red-500'
                        : 'border-iqBorder bg-white focus:border-iqText'
                        }`}
                    />
                    {errors.brideName && <p className="text-xs text-red-500">{errors.brideName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-50">Wedding Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    name="weddingDateInput"
                    min={getTodayDateString()}
                    value={formatToDateInput(formData.weddingDate, formData.weddingMonth, formData.weddingYear)}
                    onChange={handleChange}
                    className={`w-full rounded-xl border px-4 py-3 outline-none transition-colors text-sm uppercase ${errors.weddingDate || errors.weddingMonth || errors.weddingYear
                      ? 'border-red-500 bg-red-50 focus:border-red-500'
                      : 'border-iqBorder bg-white focus:border-iqText'
                      }`}
                  />
                  {(errors.weddingDate || errors.weddingMonth || errors.weddingYear) && (
                    <p className="text-xs text-red-500">
                      {errors.weddingDate && errors.weddingDate !== 'Day is required'
                        ? errors.weddingDate
                        : 'Please select a valid wedding date'}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50">Place of Wedding <span className="text-red-500">*</span></label>
                    <input
                      name="mahalName"
                      value={formData.mahalName}
                      onChange={handleChange}
                      placeholder="Enter place of wedding"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${errors.mahalName
                        ? 'border-red-500 bg-red-50 focus:border-red-500'
                        : 'border-iqBorder bg-white focus:border-iqText'
                        }`}
                    />
                    {errors.mahalName && <p className="text-xs text-red-500">{errors.mahalName}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50">Venue Address (Street / Area) <span className="text-red-500">*</span></label>
                    <input
                      name="venueAddress"
                      value={formData.venueAddress}
                      onChange={handleChange}
                      placeholder="Enter street or area..."
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${errors.venueAddress
                        ? 'border-red-500 bg-red-50 focus:border-red-500'
                        : 'border-iqBorder bg-white focus:border-iqText'
                        }`}
                    />
                    {errors.venueAddress && <p className="text-xs text-red-500">{errors.venueAddress}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50">City</label>
                    <input
                      name="venueCity"
                      value={formData.venueCity}
                      onChange={handleChange}
                      placeholder="Enter city (e.g. Bangalore)"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${errors.venueCity
                        ? 'border-red-500 bg-red-50 focus:border-red-500'
                        : 'border-iqBorder bg-white focus:border-iqText'
                        }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50">State <span className="text-red-500">*</span></label>
                    <input
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter the State"
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${errors.state
                        ? 'border-red-500 bg-red-50 focus:border-red-500'
                        : 'border-iqBorder bg-white focus:border-iqText'
                        }`}
                    />
                    {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-50">Google Map Link <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-2">
                    <input
                      name="mapLink"
                      value={formData.mapLink}
                      onChange={handleChange}
                      placeholder="https://goo.gl/maps/..."
                      className={`flex-1 rounded-xl border px-4 py-3 outline-none transition-colors text-sm ${errors.mapLink
                        ? 'border-red-500 bg-red-50 focus:border-red-500'
                        : 'border-iqBorder bg-white focus:border-iqText'
                        }`}
                    />
                    <div className="relative">
                      <button
                        type="button"
                        onMouseEnter={() => setShowMapTooltip(true)}
                        onMouseLeave={() => setShowMapTooltip(false)}
                        className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-iqBg text-iqText/60 hover:bg-iqText/10 transition-colors"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                      </button>
                      {showMapTooltip && (
                        <div className="absolute top-12 right-0 bg-black text-white text-xs rounded-lg p-3 whitespace-normal z-50 w-56 space-y-2">
                          <p className="font-semibold">How to get the Google Maps link:</p>
                          <ol className="list-decimal list-inside space-y-1">
                            <li>Open Google Maps</li>
                            <li>Search or navigate to your venue location</li>
                            <li>Right-click on the exact location pin</li>
                            <li>Click "What's here?"</li>
                            <li>Copy the link from the address bar</li>
                            <li>Paste it above</li>
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                  {errors.mapLink && <p className="text-xs text-red-500">{errors.mapLink}</p>}
                </div>

                <div className="pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex-1 rounded-full border border-iqBorder py-3 md:py-4 text-sm font-bold transition hover:bg-iqText/5"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-[2] rounded-full bg-black py-3 md:py-4 text-sm font-bold text-white shadow-xl transition hover:opacity-90"
                  >
                    Continue to Personalize
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gold">Step 02</span>
                  <h2 className="text-2xl md:text-3xl font-bold">Add Magic</h2>
                  <p className="text-sm md:text-base text-iqText/60">Choose your optional sections and fill their details.</p>
                </div>

                <div className="space-y-6">
                  {/* Photo Gallery Option */}
                  <div className="space-y-4">
                    <label className="flex items-center gap-4 cursor-pointer rounded-2xl border border-iqBorder bg-white p-4 md:p-5 transition-all hover:shadow-md">
                      <input
                        type="checkbox"
                        name="showGallery"
                        checked={formData.showGallery}
                        onChange={handleChange}
                        className="h-5 w-5 rounded accent-black flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-base md:text-lg">Photo Gallery</p>
                        <p className="text-xs text-iqText/50">Showcase your pre-wedding shoot.</p>
                      </div>
                    </label>

                    {formData.showGallery && (
                      <div className="ml-0 md:ml-9 space-y-4 rounded-2xl border border-dashed border-iqBorder p-4 md:p-6 bg-iqBg/30">
                        <p className="text-xs font-bold uppercase tracking-wider opacity-50">Upload Photos (Optional)</p>
                        <div className="grid grid-cols-3 gap-3 md:gap-4">
                          {[0, 1, 2].map(i => (
                            <div key={i} className="group relative aspect-square">
                              <label className="cursor-pointer overflow-hidden rounded-xl border border-iqBorder bg-white transition-all hover:border-iqText h-full w-full flex">
                                {uploadingPhotos[i] ? (
                                  <div className="flex h-full w-full flex-col items-center justify-center bg-iqBg text-iqText/40">
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-iqText/25 border-t-iqText"></div>
                                    <span className="text-[10px] mt-2 font-bold tracking-tight">Uploading...</span>
                                  </div>
                                ) : formData.photos?.[i] ? (
                                  <img src={formData.photos[i]} alt={`photo-${i}`} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-iqText/20 transition-colors group-hover:text-iqText">
                                    <span className="text-2xl md:text-3xl">+</span>
                                  </div>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFileChange(i, e)}
                                />
                              </label>
                              {formData.photos?.[i] && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleRemovePhoto(i)
                                  }}
                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-100 transition-opacity shadow-md hover:bg-red-600 z-50"
                                >
                                  <span className="text-xs font-bold">✕</span>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-iqText/40 italic">* These photos will be displayed in a cinematic grid. If no photos are uploaded, default images will be shown.</p>
                      </div>
                    )}
                  </div>

                  {/* Wedding Schedule Option */}
                  <div className="space-y-4">
                    <label className="flex items-center gap-4 cursor-pointer rounded-2xl border border-iqBorder bg-white p-4 md:p-5 transition-all hover:shadow-md">
                      <input
                        type="checkbox"
                        name="showSchedule"
                        checked={formData.showSchedule}
                        onChange={handleChange}
                        className="h-5 w-5 rounded accent-black flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-base md:text-lg">Wedding Schedule</p>
                        <p className="text-xs text-iqText/50">List your ceremony timelines.</p>
                      </div>
                    </label>

                    {formData.showSchedule && (
                      <div className="ml-0 md:ml-9 space-y-3 md:space-y-4">
                        {formData.scheduleItems.map((item, idx) => {
                          const { hours, minutes, ampm } = parseTimeParts(item.time)
                          return (
                            <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border border-iqBorder bg-white p-3 md:p-4 shadow-sm transition-shadow hover:shadow-md">
                              <div className="flex-shrink-0 rounded-lg bg-iqBg p-2 text-[10px] font-bold uppercase tracking-tighter text-iqText/40 whitespace-nowrap">
                                Event {idx + 1}
                              </div>
                              
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <input
                                  type="text"
                                  placeholder="HH"
                                  maxLength={2}
                                  value={hours}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '')
                                    const newTime = `${val}:${minutes} ${ampm}`
                                    handleScheduleChange(idx, 'time', newTime)
                                  }}
                                  onBlur={(e) => {
                                    let val = e.target.value.trim()
                                    if (val) {
                                      let num = parseInt(val, 10)
                                      if (isNaN(num)) num = 12
                                      num = Math.min(Math.max(num, 1), 12)
                                      val = String(num).padStart(2, '0')
                                    } else {
                                      val = '12'
                                    }
                                    const newTime = `${val}:${minutes} ${ampm}`
                                    handleScheduleChange(idx, 'time', newTime)
                                  }}
                                  className="w-12 text-center rounded-lg border border-iqBorder bg-transparent py-2 text-sm font-semibold outline-none focus:border-iqText transition-colors"
                                />
                                <span className="text-iqText/40 font-bold">:</span>
                                <input
                                  type="text"
                                  placeholder="MM"
                                  maxLength={2}
                                  value={minutes}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '')
                                    const newTime = `${hours}:${val} ${ampm}`
                                    handleScheduleChange(idx, 'time', newTime)
                                  }}
                                  onBlur={(e) => {
                                    let val = e.target.value.trim()
                                    if (val) {
                                      let num = parseInt(val, 10)
                                      if (isNaN(num)) num = 0
                                      num = Math.min(Math.max(num, 0), 59)
                                      val = String(num).padStart(2, '0')
                                    } else {
                                      val = '00'
                                    }
                                    const newTime = `${hours}:${val} ${ampm}`
                                    handleScheduleChange(idx, 'time', newTime)
                                  }}
                                  className="w-12 text-center rounded-lg border border-iqBorder bg-transparent py-2 text-sm font-semibold outline-none focus:border-iqText transition-colors"
                                />
                                <select
                                  value={ampm}
                                  onChange={(e) => {
                                    const val = e.target.value
                                    const newTime = `${hours}:${minutes} ${val}`
                                    handleScheduleChange(idx, 'time', newTime)
                                  }}
                                  className="rounded-lg border border-iqBorder bg-white py-2 px-1 text-sm font-semibold outline-none focus:border-iqText transition-colors cursor-pointer"
                                >
                                  <option value="AM">AM</option>
                                  <option value="PM">PM</option>
                                </select>
                              </div>

                              <div className="hidden sm:block h-4 w-px bg-iqBorder" />
                              <input
                                placeholder="Event Name"
                                value={item.title}
                                onChange={(e) => handleScheduleChange(idx, 'title', e.target.value)}
                                className="flex-1 rounded-lg border border-iqBorder bg-transparent px-2 py-2 text-sm outline-none focus:ring-0 focus:border-iqText transition-colors"
                              />
                              {idx > 2 && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteScheduleItem(idx)}
                                  className="flex-shrink-0 text-iqText/50 hover:text-red-500 transition-colors text-sm font-semibold"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          )
                        })}
                        <button
                          type="button"
                          onClick={handleAddScheduleItem}
                          className="w-full rounded-lg border-2 border-dashed border-iqBorder py-3 text-sm font-bold text-iqText/60 hover:text-iqText hover:border-iqText transition-colors"
                        >
                          + Add More Event
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 rounded-full border border-iqBorder py-3 md:py-4 text-sm font-bold transition hover:bg-iqText/5"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-[2] rounded-full bg-black py-3 md:py-4 text-sm font-bold text-white shadow-xl transition hover:opacity-90"
                  >
                    Review My Invitation
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-2xl md:text-3xl font-bold">Ready for Preview?</h2>
                <p className="text-sm md:text-base text-iqText/60">You've successfully customized your {template?.name || 'invitation'}. Click below to see how it looks!</p>

                <div className="rounded-2xl border border-iqBorder bg-white p-4 md:p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-50">Template</span>
                    <span className="font-bold">{template?.name || templateId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-50">Couple</span>
                    <span className="font-bold">{formData.groomName} & {formData.brideName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-50">Date</span>
                    <span className="font-bold">{formData.weddingDate} {formData.weddingMonth} {formData.weddingYear}</span>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 rounded-full border border-iqBorder py-3 md:py-4 text-sm font-bold transition hover:bg-iqText/5"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] rounded-full bg-black py-3 md:py-4 text-sm font-bold text-white shadow-xl transition hover:opacity-90"
                  >
                    View Preview
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </main>

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
