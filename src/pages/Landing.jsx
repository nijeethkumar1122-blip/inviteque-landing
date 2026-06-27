import { useState, useEffect, useRef, memo } from 'react'
import { motion, useTime, useTransform, useInView } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
const logo = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1779029564/g49iwmxbue23d5o6v73o.png"
import { templates } from '../templates/templates.js'
import { fadeUp, staggerChildren, viewportOnce } from '../motionVariants.js'
import { useAuth } from '../context/AuthContext'
import { useDraft } from '../context/DraftContext'
import MobileNav from '../components/MobileNav'
import { LazyImage } from '../components/LazyImage'
const tailorRomanceBg = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1782036339/m2xlgvmlglao8ulz60dd.jpg"

const templateCardPop = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: (index = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'tween',
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      delay: index * 0.09,
    },
  }),
}

const InfiniteCarouselCard = memo(function InfiniteCarouselCard({ t, i, total, time, isMobile }) {
  const duration = 70000;
  // Reduce orbit spacing on mobile to compress carousel
  const orbitX = isMobile ? 820 : 1100;
  const orbitZ = isMobile ? 3300 : 1000;

  const pos = useTransform(time, tValue => {
    const rawPos = (tValue / duration) + (i / total);
    return rawPos % 1; // Loops infinitely from 0 to 1
  });

  // Mathematically perfect circular arc using Trigonometry
  const x = useTransform(pos, p => {
    const angle = (0.5 - p) * Math.PI; // p=0 -> pi/2 (right). p=0.5 -> 0 (center). p=1 -> -pi/2 (left).
    return Math.sin(angle) * orbitX;
  });

  const z = useTransform(pos, p => {
    const angle = (0.5 - p) * Math.PI;
    return (Math.cos(angle) - 1) * orbitZ;
  });

  const rotateY = useTransform(pos, p => {
    const angle = (0.5 - p) * Math.PI;
    // Right side (p < 0.5, positive angle) needs negative rotateY to face inward (Left)
    return -(angle / (Math.PI / 2)) * 55;
  });

  const scale = useTransform(pos, p => {
    const angle = (0.5 - p) * Math.PI;
    return 0.65 + 0.35 * Math.cos(angle); // Scale smoothly from 0.65 at edges to 1 at center
  });

  const opacity = useTransform(pos, p => {
    if (p < 0.05) return p / 0.05; // Fade in
    if (p > 0.95) return (1 - p) / 0.05; // Fade out
    return 1;
  });

  // Stable z-index ordering with a deterministic tie-breaker.
  // Prevents flicker/overlap when two cards compute the same z-index near the center.
  const zIndex = useTransform(pos, p => {
    const closeness = Math.max(0, 1 - Math.abs(p - 0.5) * 2); // 0..1
    const base = Math.floor(closeness * 1000); // 0..1000
    return base * 10 + (total - i);
  });

  return (
    <motion.div
      className="absolute left-1/2 top-[40%] -ml-[100px] -mt-[120px] w-[200px] md:-ml-[140px] md:-mt-[210px] md:w-[280px]"
      style={{ x, z, rotateY, scale, opacity, zIndex, transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
    >
      <article className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-iqBorder/30 bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3),0_30px_60px_-30px_rgba(0,0,0,0.3)]">
        <LazyImage
          src={t.thumbnail}
          alt={t.name}
          className="aspect-[3/4.5] w-full object-cover"
        />
      </article>
    </motion.div>
  )
})

/* ─────────────────────────────────────── */
function ChooseTemplateVisual() {
  return (
    <div className="relative h-64 w-full flex items-center justify-center overflow-hidden mb-8">
      {/* Center Phone - iPhone 17 Pro Premium Mockup */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="relative w-[110px] h-[220px] rounded-[1.8rem] border-[3px] border-[#2c2c2e] bg-[#1d1d1f] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] overflow-hidden z-10 ring-1 ring-white/10"
      >
        {/* Dynamic Island */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-6 h-2 bg-black rounded-full z-30 shadow-[0_0.5px_1px_rgba(0,0,0,0.8)]" />
        
        {/* Premium screen glossy reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.12] pointer-events-none z-20" />

        {/* Screen container */}
        <div className="w-full h-full rounded-[1.6rem] overflow-hidden relative bg-white">
          <img
            src={templates[3]?.thumbnail}
            alt="Template choice"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
      
      {/* Left side peeking template */}
      <div className="absolute left-[8%] w-24 h-48 rounded-[1.2rem] border border-black/10 bg-white opacity-40 overflow-hidden transform -rotate-12 scale-90 translate-y-4">
        <img src={templates[4]?.thumbnail} alt="Template left" className="w-full h-full object-cover" />
      </div>
      {/* Right side peeking template */}
      <div className="absolute right-[8%] w-24 h-48 rounded-[1.2rem] border border-black/10 bg-white opacity-40 overflow-hidden transform rotate-12 scale-90 translate-y-4">
        <img src={templates[5]?.thumbnail} alt="Template right" className="w-full h-full object-cover" />
      </div>
    </div>
  )
}

const names = [
  { n1: "Rohan", n2: "Anaya" },
  { n1: "Aaditya", n2: "Veera" },
  { n1: "Abhishek", n2: "Meera" }
]

function CustomisePublishVisual() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })

  const [displayText1, setDisplayText1] = useState("")
  const [displayText2, setDisplayText2] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)

  useEffect(() => {
    if (!isInView) {
      setTimeout(() => setDisplayText1(prev => prev !== "" ? "" : prev), 0)
      setTimeout(() => setDisplayText2(prev => prev !== "" ? "" : prev), 0)
      setTimeout(() => setIsDeleting(prev => prev !== false ? false : prev), 0)
      return
    }

    let timer;
    const currentPair = names[loopNum % names.length]
    const full1 = currentPair.n1
    const full2 = currentPair.n2

    const handleType = () => {
      if (!isDeleting) {
        // Typing phase
        const next1 = full1.substring(0, displayText1.length + 1)
        const next2 = full2.substring(0, displayText2.length + 1)

        setDisplayText1(next1)
        setDisplayText2(next2)

        if (next1 === full1 && next2 === full2) {
          // Finished typing both fully, pause before deleting
          timer = setTimeout(() => {
            setIsDeleting(true)
          }, 2000)
        } else {
          // Keep typing
          timer = setTimeout(handleType, 120)
        }
      } else {
        // Deleting phase
        const next1 = full1.substring(0, displayText1.length - 1)
        const next2 = full2.substring(0, displayText2.length - 1)

        setDisplayText1(next1)
        setDisplayText2(next2)

        if (next1 === "" && next2 === "") {
          // Fully deleted, move to next name
          setIsDeleting(false)
          setLoopNum(prev => prev + 1)
        } else {
          // Keep deleting
          timer = setTimeout(handleType, 60)
        }
      }
    }

    timer = setTimeout(handleType, isDeleting ? 60 : 120)

    return () => clearTimeout(timer)
  }, [displayText1, displayText2, isDeleting, loopNum, isInView])

  return (
    <div ref={containerRef} className="relative h-64 w-full flex items-center justify-center overflow-hidden mb-8">
      {/* Background Invite Preview Card */}
      <div className="absolute w-44 h-56 rounded-2xl border border-iqBorder bg-[#FFF6F2] shadow-luxury overflow-hidden transform -rotate-6 -translate-x-10 scale-95 opacity-80 flex flex-col items-center p-4">
        <div className="w-full h-24 rounded-lg overflow-hidden mb-2 relative">
          <img src={tailorRomanceBg} alt="background preview" className="w-full h-full object-cover opacity-90" />
        </div>
        <span className="text-[6px] font-bold uppercase tracking-[0.2em] text-[#7B0F1A] mb-1">Save the Date</span>
        <h4 className="text-[12px] font-serif text-[#7B0F1A] text-center font-bold">
          {displayText1} <span className="text-[8px] block">&amp;</span> {displayText2}
        </h4>
      </div>

      {/* Floating Customize Panel Mockup (Matching our exact Builder UI!) */}
      <div className="absolute w-48 rounded-xl border border-iqBorder bg-white/95 backdrop-blur-md p-3.5 shadow-xl transform translate-x-10 translate-y-4 scale-95 z-10 flex flex-col space-y-2 font-saas text-left">
        <div className="flex justify-between items-center pb-1 border-b border-iqBorder/60">
          <span className="text-[9px] font-bold text-iqText uppercase tracking-wider">Step 01 — Details</span>
          <span className="text-[7.5px] bg-[#D4AF37]/10 text-[#D4AF37] px-1.5 py-0.5 rounded font-bold font-mono">Live</span>
        </div>

        <div className="space-y-0.5">
          <label className="text-[7px] font-bold text-iqText/40 uppercase tracking-wider block">Groom's Name <span className="text-red-500">*</span></label>
          <div className="w-full rounded-md border border-iqBorder bg-white px-2 py-1 text-[8.5px] font-bold text-iqText/80 flex items-center justify-between h-[20px]">
            <span>{displayText1}</span>
            {!isDeleting && displayText1.length < names[loopNum % names.length].n1.length && (
              <span className="text-iqAccent animate-pulse font-normal">|</span>
            )}
          </div>
        </div>

        <div className="space-y-0.5">
          <label className="text-[7px] font-bold text-iqText/40 uppercase tracking-wider block">Bride's Name <span className="text-red-500">*</span></label>
          <div className="w-full rounded-md border border-iqBorder bg-white px-2 py-1 text-[8.5px] font-bold text-iqText/80 flex items-center justify-between h-[20px]">
            <span>{displayText2}</span>
            {!isDeleting && displayText1 === names[loopNum % names.length].n1 && displayText2.length < names[loopNum % names.length].n2.length && (
              <span className="text-iqAccent animate-pulse font-normal">|</span>
            )}
          </div>
        </div>

        <div className="space-y-0.5">
          <label className="text-[7px] font-bold text-iqText/40 uppercase tracking-wider block">Wedding Date <span className="text-red-500">*</span></label>
          <div className="w-full rounded-md border border-iqBorder bg-white px-2 py-1 text-[8.5px] font-bold text-iqText/80 font-mono">
            2026-08-18
          </div>
        </div>

        <div className="space-y-0.5">
          <label className="text-[7px] font-bold text-iqText/40 uppercase tracking-wider block">Place of Wedding <span className="text-red-500">*</span></label>
          <div className="w-full rounded-md border border-iqBorder bg-white px-2 py-1 text-[8.5px] font-bold text-iqText/80 truncate">
            The Grand Palace
          </div>
        </div>
      </div>
    </div>
  )
}

function ShareAnywhereVisual() {
  const [msgCount, setMsgCount] = useState(0)
  const chatRef = useRef(null)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })

  useEffect(() => {
    if (!isInView) {
      setTimeout(() => setMsgCount(prev => prev !== 0 ? 0 : prev), 0)
      return
    }

    let active = true
    const runSequence = () => {
      if (!active) return
      setMsgCount(0)

      const timers = [
        setTimeout(() => active && setMsgCount(1), 200),   // Msg 1 (Pop up link card immediately)
        setTimeout(() => active && setMsgCount(2), 2200),  // Msg 2 (Congrats! 💍)
        setTimeout(() => active && setMsgCount(3), 4200),  // Msg 3 (Did you hire a designer? 😍)
        setTimeout(() => active && setMsgCount(4), 6200),  // Msg 4 (No, we designed it on Inviteque! ✨)
        setTimeout(() => active && setMsgCount(5), 8200),  // Msg 5 (Wow, that's amazing! 🚀)
      ]

      const restartTimer = setTimeout(() => {
        if (active) runSequence()
      }, 14000)

      return () => {
        timers.forEach(clearTimeout)
        clearTimeout(restartTimer)
      }
    }

    const startTimer = setTimeout(() => {
      runSequence()
    }, 100)

    return () => {
      active = false
      clearTimeout(startTimer)
    }
  }, [isInView])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [msgCount])

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        ref={chatRef}
        className="relative h-64 w-full rounded-2xl bg-[#EFEAE2] border border-iqBorder overflow-y-auto p-4 flex flex-col space-y-2.5 text-left mb-8 shadow-inner select-none no-scrollbar"
      >
        {/* 1. Shared Invite Link Card (Starts the conversation!) */}
        {msgCount >= 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="max-w-[80%] self-end rounded-2xl bg-[#DCF8C6] p-1 shadow-md overflow-hidden flex flex-col font-saas border border-[#c5e1b2] flex-shrink-0"
          >
            {/* Authentic WhatsApp Rich Link Preview Card (Vertical Layout) */}
            <div className="rounded-xl bg-[#000000]/[0.03] overflow-hidden flex flex-col items-stretch border border-black/05 flex-shrink-0 select-none text-left">
              {/* Invite poster thumbnail in rectangular shape (top area - object-top aligned) */}
              <div className="w-full aspect-[16/10] bg-white relative flex-shrink-0 border-b border-black/05 overflow-hidden">
                <img src={templates[0]?.thumbnail} alt="Chat invite preview" className="w-full h-full object-cover object-top" />
              </div>
              {/* Text details (bottom area) */}
              <div className="p-2 flex flex-col justify-center text-left min-w-0">
                <h5 className="text-[9.5px] font-bold text-iqText leading-tight truncate">Abhishek &amp; Meera's Wedding 💍</h5>
                <p className="text-[7.5px] text-iqText/60 mt-0.5 line-clamp-2 leading-relaxed">You are cordially invited! Click to view our details, venue map, and photos.</p>
                <span className="text-[7px] text-iqText/40 font-medium tracking-wide mt-1 block truncate">inviteque.com</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. Friend reacts in amazement */}
        {msgCount >= 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="max-w-[78%] rounded-2xl rounded-tl-none bg-white p-2.5 shadow-sm text-[11px] text-iqText font-saas flex-shrink-0"
          >
            Congrats Abhishek &amp; Meera! 💍 The website looks stunning.
          </motion.div>
        )}

        {/* 3. Friend asks who designed it */}
        {msgCount >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="max-w-[78%] rounded-2xl rounded-tl-none bg-white p-2.5 shadow-sm text-[11px] text-iqText font-saas flex-shrink-0"
          >
            Did you guys hire a professional designer for this? It feels so premium! 😍
          </motion.div>
        )}

        {/* 4. Couple replies explaining it is Inviteque */}
        {msgCount >= 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="max-w-[78%] self-end rounded-2xl rounded-tr-none bg-[#DCF8C6] p-2.5 shadow-sm text-[11px] text-iqText font-saas flex-shrink-0"
          >
            No, we made it ourselves in minutes using Inviteque! It was super easy. ✨
          </motion.div>
        )}

        {/* 5. Friend responds in excitement */}
        {msgCount >= 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="max-w-[78%] rounded-2xl rounded-tl-none bg-white p-2.5 shadow-sm text-[11px] text-iqText font-saas flex-shrink-0"
          >
            Wow, that is amazing! I am going to try it too. 🚀
          </motion.div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Why Digital micro-animated components
   ───────────────────────────────────────── */
function InstantPublishingIcon() {
  return (
    <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
      {/* Outer pulsing rings */}
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        className="absolute inset-0 rounded-full bg-iqAccent/10"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
        className="absolute w-14 h-14 rounded-full bg-iqAccent/20"
      />
      {/* Central active bolt */}
      <motion.div
        animate={{ y: [-3, 3, -3], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 text-4xl"
      >
        ⚡
      </motion.div>
    </div>
  )
}

function AffordableIcon() {
  return (
    <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
      {/* Sparkling stars */}
      <motion.div
        animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1 right-2 text-sm"
      >
        ✨
      </motion.div>
      <motion.div
        animate={{ scale: [1.2, 0.5, 1.2], opacity: [1, 0.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1 left-2 text-xs"
      >
        ✨
      </motion.div>
      {/* Floating Price Tag/Coin */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 text-4xl drop-shadow-lg"
      >
        💎
      </motion.div>
    </div>
  )
}

function EasyUpdatesIcon() {
  return (
    <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
      {/* Synchronizing spinning loop */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute w-16 h-16 rounded-full border border-dashed border-iqAccent/40 flex items-center justify-center"
      />
      {/* Pulsing Sync arrows */}
      <motion.div
        animate={{ scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 text-4xl"
      >
        🔄
      </motion.div>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-iqBorder bg-iqCard px-3 py-1 text-[11px] tracking-[0.18em] uppercase text-iqText/70">
      {children}
    </span>
  )
}


function PricePill({ label }) {
  const isFree = String(label).toLowerCase().includes('free')
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold',
        isFree
          ? 'border-iqBorder bg-iqCard text-iqText'
          : 'border-transparent bg-iqAccent text-iqCard',
      ].join(' ')}
    >
      {label}
    </span>
  )
}

function ComingSoonPill() {
  return (
    <span className="inline-flex items-center rounded-full border border-iqBorder bg-iqCard px-3 py-1 text-xs font-semibold text-iqText/70">
      Coming soon
    </span>
  )
}

export default function Landing() {
  const [displayCount, setDisplayCount] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const { user, logout } = useAuth()
  const { resetDraft } = useDraft()
  const navigate = useNavigate()
  const time = useTime()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const carouselTemplates = templates.length >= 10 ? templates : [...templates, ...templates]
  const initialDisplay = isMobile ? 3 : 6
  const incrementBy = isMobile ? 3 : 6
  const currentDisplay = displayCount ?? initialDisplay
  const visibleTemplates = templates.slice(0, currentDisplay)

  return (
    <main className="min-h-[100svh] w-full bg-iqBg font-saas text-iqText">
      <header className="sticky top-0 z-50 border-b border-iqBorder bg-white/70 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Inviteque" className="h-8 w-auto" />
            <span className="font-parisienne text-3xl font-normal text-iqText hidden sm:inline leading-none">Inviteque</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#about" className="text-sm font-semibold text-iqText/70 hover:text-iqText transition-colors">
              How it Works
            </a>
            <a href="#templates" className="text-sm font-semibold text-iqText/70 hover:text-iqText transition-colors">
              Templates
            </a>
            <a href="#pricing" className="text-sm font-semibold text-iqText/70 hover:text-iqText transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-sm font-semibold text-iqText/70 hover:text-iqText transition-colors">
              FAQs
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 rounded-full border border-iqBorder bg-iqBg/50 px-4 py-1.5 shadow-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-iqText text-[10px] font-bold text-white">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-sm font-bold text-iqText">{user.name}</span>
                <div className="h-4 w-[1px] bg-iqBorder mx-1" />
                <Link
                  to="/account"
                  className="text-xs font-bold text-iqText hover:text-iqAccent transition-colors"
                >
                  Account
                </Link>
                <div className="h-4 w-[1px] bg-iqBorder mx-1" />
                <button
                  onClick={logout}
                  className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-semibold text-iqText/70 hover:text-iqText">
                  Log In
                </Link>
                <Link to="/signup" className="rounded-full bg-black px-5 py-2 text-sm font-bold text-white transition hover:bg-black/90 shadow-lg">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden">
            <MobileNav />
          </div>
        </nav>
      </header>

      {/* 1) Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FFF9F9] to-iqBg pt-12 pb-16 md:pt-16 md:pb-24">
        {/* Decorative subtle glow background */}
        <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 bg-iqAccent/5 blur-[120px]" />

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto max-w-5xl px-5 text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="text-balance text-4xl font-bold tracking-tight text-iqText md:text-6xl lg:text-7xl"
          >
            Beautiful Wedding <br className="hidden md:block" /> Websites in Minutes
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-pretty text-lg font-medium leading-relaxed text-iqText/60 md:text-xl"
          >
            Choose a template, add your details, and share <br className="hidden sm:block" /> your love story instantly.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <a
              href="#templates"
              className="inline-flex h-14 items-center justify-center rounded-full bg-black px-10 text-base font-semibold text-white transition-all hover:scale-105 hover:bg-black/90 active:scale-95 shadow-xl"
            >
              Explore Templates
            </a>
          </motion.div>
        </motion.div>

        {/* Infinite Curved Full-Screen Carousel Layout */}
        <div className="mt-8 md:mt-10 relative h-[450px] md:h-[600px] w-full overflow-hidden [perspective:1000px] md:[perspective:2000px] [transform-style:preserve-3d]">
          {/* Duplicate only when template count is low (prevents crowding with 12 cards) */}
          {carouselTemplates.map((t, i, arr) => (
            <InfiniteCarouselCard key={`${t.id}-${i}`} t={t} i={i} total={arr.length} time={time} isMobile={isMobile} />
          ))}
        </div>
      </section>

      {/* 2) How It Works Section */}
      <section id="about" className="border-t border-iqBorder bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>How it works</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="mt-6 text-3xl md:text-5xl font-bold tracking-tight text-iqText"
            >
              Three Simple Steps to Invite
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-sm text-iqText/60 md:text-base text-balance"
            >
              Create and share your professional wedding invitation website in minutes.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Card 1 - Choose a template */}
            <motion.article
              variants={fadeUp}
              className="flex flex-col items-center text-center p-8 rounded-[2rem] border border-iqBorder bg-iqBg/20 shadow-luxury h-full hover:shadow-2xl transition duration-300"
            >
              <ChooseTemplateVisual />
              <h3 className="text-xl font-extrabold text-iqText mb-2">01 — Curate Your Style</h3>
              <p className="text-sm text-iqText/60 max-w-[280px]">
                Select from our exclusive collection of luxury digital invitation templates crafted to look breathtaking on all modern viewports.
              </p>
            </motion.article>

            {/* Card 2 - Customise & Publish */}
            <motion.article
              variants={fadeUp}
              className="flex flex-col items-center text-center p-8 rounded-[2rem] border border-iqBorder bg-iqBg/20 shadow-luxury h-full hover:shadow-2xl transition duration-300"
            >
              <CustomisePublishVisual />
              <h3 className="text-xl font-extrabold text-iqText mb-2">02 — Tailor the Romance</h3>
              <p className="text-sm text-iqText/60 max-w-[280px]">
                Bring your invite to life by adding your love story timeline, high-res photos, venue details, and schedule using our elegant builder.
              </p>
            </motion.article>

            {/* Card 3 - Share anywhere */}
            <motion.article
              variants={fadeUp}
              className="flex flex-col items-center text-center p-8 rounded-[2rem] border border-iqBorder bg-iqBg/20 shadow-luxury h-full hover:shadow-2xl transition duration-300"
            >
              <ShareAnywhereVisual />
              <h3 className="text-xl font-extrabold text-iqText mb-2">03 — Broadcast the Magic</h3>
              <p className="text-sm text-iqText/60 max-w-[280px]">
                Broadcast your gorgeous wedding website link instantly with friends and family across WhatsApp, Instagram, or email.
              </p>
            </motion.article>
          </motion.div>
        </div>
      </section>

      {/* 3) Template grid */}
      <section id="templates" className="border-t border-iqBorder">
        <div className="mx-auto w-full max-w-7xl px-5 py-14 md:py-16">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Templates</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="mt-6 text-3xl font-bold md:text-4xl">
              Designed for Your Big Day
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-sm text-iqText/70 md:text-base">
              Clean, minimal, premium templates—made for mobile and beautiful on desktop.
            </motion.p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {visibleTemplates.map((t, index) => (
              <motion.article
                key={t.id}
                variants={templateCardPop}
                custom={index}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="overflow-hidden rounded-card border border-iqBorder bg-iqCard shadow-luxury"
              >
                <div className="relative">
                  <Link to={t.available ? t.href : '#templates'} className="block">
                    <LazyImage
                      src={t.thumbnail}
                      alt={t.name}
                      className="aspect-[3/4] w-full object-cover"
                    />
                  </Link>
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <PricePill label={t.priceLabel} />
                    {t.popular ? (
                      <span className="inline-flex items-center rounded-full bg-iqText px-3 py-1 text-xs font-semibold text-iqCard">
                        Popular
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="px-5 py-5">
                  <h3 className="text-sm font-bold md:text-base">{t.name}</h3>
                  <p className="mt-1 text-xs text-iqText/70 line-clamp-2">{t.description}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {t.available ? null : <ComingSoonPill />}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href={t.available ? t.href : '#templates'}
                      target={t.available ? '_blank' : undefined}
                      rel={t.available ? 'noopener noreferrer' : undefined}
                      className={[
                        'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition',
                        t.available
                          ? 'bg-black text-white hover:scale-105 hover:bg-black/90 active:scale-95 shadow-xl'
                          : 'cursor-not-allowed bg-black/50 text-white/50'
                      ].join(' ')}
                    >
                      Preview
                    </a>
                    <button
                      onClick={() => {
                        if (!t.available) return
                        resetDraft()
                        if (user) navigate(`/builder/${t.id}`)
                        else navigate('/login')
                      }}
                      disabled={!t.available}
                      className={[
                        'inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold transition',
                        t.available
                          ? 'border-iqBorder bg-iqCard text-iqText hover:bg-iqText/5'
                          : 'cursor-not-allowed border-iqBorder bg-iqCard text-iqText/40',
                      ].join(' ')}
                      aria-disabled={!t.available}
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {currentDisplay < templates.length ? (
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="mt-12 flex justify-center">
              <button
                onClick={() => setDisplayCount(currentDisplay + incrementBy)}
                className="group flex items-center gap-2 rounded-full border border-iqBorder bg-white px-8 py-3 text-sm font-bold text-iqText shadow-luxury transition hover:bg-iqText hover:text-white"
              >
                Show More Templates
                <span className="transition-transform duration-300 group-hover:translate-y-1">
                  ↓
                </span>
              </button>
            </motion.div>
          ) : null}
        </div>
      </section>

      {/* 4) Comparison */}
      <section className="border-t border-iqBorder bg-gradient-to-b from-[#FFFDFB] to-[#FFF9F5]">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Better than Paper</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="mt-6 text-3xl font-bold md:text-5xl tracking-tight">
              An Elevated Guest Experience
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-sm text-iqText/60 md:text-base text-pretty">
              Ditch the rigid limitations of traditional printed invitations and normal picture uploads. Compare and see why Inviteque stands out.
            </motion.p>
          </motion.div>

          {/* Unified Comparison Table (100% responsive in table format on all screens) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-12 overflow-x-auto w-full rounded-[1.8rem] border border-iqBorder bg-white shadow-luxury no-scrollbar"
          >
            <table className="w-full border-collapse text-left text-[10px] xs:text-xs md:text-sm table-fixed min-w-[300px]">
              <colgroup>
                <col className="w-[37%] md:w-[35%]" />
                <col className="w-[21%] md:w-[21%]" />
                <col className="w-[21%] md:w-[22%]" />
                <col className="w-[21%] md:w-[22%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-iqBorder bg-iqBg/50 text-iqText uppercase tracking-wider text-[9px] xs:text-[10px] md:text-xs font-extrabold">
                  <th className="px-2.5 md:px-6 py-3.5 md:py-4 font-black">Feature</th>
                  <th className="px-1 md:px-6 py-3.5 md:py-4 text-center text-iqText/55">
                    <span className="hidden md:inline">Traditional Paper</span>
                    <span className="inline md:hidden">Paper</span>
                  </th>
                  <th className="px-1 md:px-6 py-3.5 md:py-4 text-center text-iqText/55">
                    <span className="hidden md:inline">WhatsApp Image / PDF</span>
                    <span className="inline md:hidden">Image/PDF</span>
                  </th>
                  <th className="px-1 md:px-6 py-3.5 md:py-4 text-center text-[#1a5f20] bg-[#f4faf4]/20">
                    <span className="hidden md:inline">Inviteque Digital Website</span>
                    <span className="inline md:hidden">Inviteque</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-iqBorder">
                {[
                  {
                    feature: 'Google Map Navigation',
                    paper: '✕',
                    image: '✕',
                    inviteque: '✓',
                    iqClass: 'text-emerald-600 font-extrabold bg-[#f4faf4]/40 text-center'
                  },
                  {
                    feature: 'Live Countdown Timer',
                    paper: '✕',
                    image: '✕',
                    inviteque: '✓',
                    iqClass: 'text-emerald-600 font-extrabold bg-[#f4faf4]/40 text-center'
                  },
                  {
                    feature: 'Cinematic Animations',
                    paper: '✕',
                    image: '✕',
                    inviteque: '✓',
                    iqClass: 'text-emerald-600 font-extrabold bg-[#f4faf4]/40 text-center'
                  },
                  {
                    feature: 'Instant Live Updates',
                    paper: '✕',
                    image: '✕',
                    inviteque: '✓',
                    iqClass: 'text-emerald-600 font-extrabold bg-[#f4faf4]/40 text-center'
                  },
                  {
                    feature: 'Environmental Impact',
                    paper: '✕',
                    image: '✓',
                    inviteque: '✓',
                    iqClass: 'text-emerald-600 font-extrabold bg-[#f4faf4]/40 text-center'
                  }
                ].map((row) => (
                  <tr key={row.feature} className="hover:bg-iqBg/5 transition-colors">
                    <td className="px-2.5 md:px-6 py-3.5 md:py-5 font-bold text-iqText bg-[#FFFDFB]/40 break-words leading-tight">{row.feature}</td>
                    <td className="px-1 md:px-6 py-3.5 md:py-5 text-center text-xs xs:text-sm md:text-base font-bold">
                      {row.paper === '✕' ? <span className="text-red-500">✕</span> : row.paper}
                    </td>
                    <td className="px-1 md:px-6 py-3.5 md:py-5 text-center text-xs xs:text-sm md:text-base font-bold">
                      {row.image === '✓' ? <span className="text-emerald-600">✓</span> : <span className="text-red-500">✕</span>}
                    </td>
                    <td className={`px-1 md:px-6 py-3.5 md:py-5 ${row.iqClass} text-xs xs:text-sm md:text-base`}>{row.inviteque}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto mt-12 flex max-w-3xl items-center justify-center"
          >
            <a
              href="#templates"
              className="inline-flex h-14 items-center justify-center rounded-full bg-black px-10 text-base font-semibold text-white shadow-xl transition-all hover:scale-105 hover:bg-black/90 active:scale-95"
            >
              Curate Your Invite
            </a>
          </motion.div>
        </div>
      </section>

      {/* 4b) Why Digital Invites */}
      <section className="border-t border-iqBorder">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-16">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Why Choose Digital</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="mt-6 text-3xl font-bold md:text-4xl">
              Modern Invitations for Modern Couples
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-sm text-iqText/70 md:text-base">
              No printing delays, no reprint costs, no updates hassle. Share a beautiful link instantly.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {/* Card 1 - Instant Publishing */}
            <motion.article
              variants={fadeUp}
              className="rounded-card border border-iqBorder bg-white p-8 shadow-luxury text-center hover:shadow-2xl transition duration-300"
            >
              <InstantPublishingIcon />
              <h3 className="text-lg font-bold text-iqText mb-3">Instant Publishing</h3>
              <p className="text-sm text-iqText/70">Go live in minutes. Share your gorgeous luxury wedding link immediately with zero delays.</p>
            </motion.article>

            {/* Card 2 - Affordable Premium */}
            <motion.article
              variants={fadeUp}
              className="rounded-card border border-iqBorder bg-white p-8 shadow-luxury text-center hover:shadow-2xl transition duration-300"
            >
              <AffordableIcon />
              <h3 className="text-lg font-bold text-iqText mb-3">Affordable Luxury</h3>
              <p className="text-sm text-iqText/70">Unlock spectacular, fully responsive designs at a fraction of the cost of traditional printing.</p>
            </motion.article>

            {/* Card 3 - Easy Live Updates */}
            <motion.article
              variants={fadeUp}
              className="rounded-card border border-iqBorder bg-white p-8 shadow-luxury text-center hover:shadow-2xl transition duration-300"
            >
              <EasyUpdatesIcon />
              <h3 className="text-lg font-bold text-iqText mb-3">Easy Live Updates</h3>
              <p className="text-sm text-iqText/70">Adjust timing, venue map, or details anytime—changes are synced live for your guests in real-time.</p>
            </motion.article>
          </motion.div>
        </div>
      </section>

      {/* 5) Pricing */}
      <section id="pricing" className="border-t border-iqBorder bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:py-24">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Pricing</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="mt-6 text-3xl font-bold md:text-4xl text-iqText">
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-sm text-iqText/70 md:text-base">
              One-time payment for your perfect wedding website. No monthly subscriptions.
            </motion.p>
          </motion.div>

          <div className="mt-16 flex justify-center">
            <motion.article
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="w-full max-w-md rounded-[2.5rem] border border-iqBorder bg-white p-8 md:p-12 shadow-luxury text-center"
            >
              <h3 className="text-lg font-bold uppercase tracking-widest text-iqText/50">Template Pricing</h3>
              <div className="mt-6 flex items-baseline justify-center gap-1">
                <span className="text-6xl font-extrabold text-iqText">₹999</span>
                <span className="text-lg font-medium text-iqText/40">per template</span>
              </div>
              <p className="mt-6 text-sm font-medium text-iqText/60">
                Everything you need to create a stunning wedding invite website.
              </p>

              <div className="mt-10 space-y-4 border-y border-iqBorder py-8 text-left">
                {[
                  'Premium Wedding Template',
                  'Custom URL / Name Link',
                  'Interactive Google Maps Venue',
                  'Cinematic Love Story Timeline',
                  'High-Res Photo Gallery',
                  '6 Months Validity & Hosting',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm font-semibold text-iqText/80">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] text-white">✓</span>
                    {feature}
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <a
                  href="#templates"
                  className="flex h-14 items-center justify-center rounded-full bg-black text-base font-bold text-white transition-transform hover:scale-[1.02] active:scale-95"
                >
                  Choose Your Template
                </a>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* 6) FAQ */}
      <section id="faq" className="border-t border-iqBorder">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-16">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>FAQ</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="mt-6 text-3xl font-bold md:text-4xl">
              Questions & Answers
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-sm text-iqText/70 md:text-base">
              Everything you need to know.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto mt-10 max-w-3xl space-y-3"
          >
            {[
              {
                q: 'How do I create and customize my wedding website on Inviteque?',
                a: 'It is incredibly simple! Just choose a premium template you love, log in, and enter your details (couple names, wedding date, story milestones, event schedule, and venue details). Our intuitive real-time builder shows you all changes instantly as you type. Once you are satisfied, pay the one-time activation fee to make it go live.',
              },
              {
                q: 'Can I make changes to my website after it is published and shared?',
                a: 'Absolutely! We know that wedding plans can shift. You can log into your Inviteque account at any point, modify any details (such as venue location, timing, schedule, or text), and hit save. The updates will instantly reflect live for all your guests, with no reprint costs or extra fees.',
              },
              {
                q: 'How long will my wedding invitation link remain active and hosted?',
                a: 'Your unique wedding website remains completely hosted and active for a full 6 months from your date of publishing. This gives you and your guests plenty of time to access event details, view photos, and read your story before, during, and after your big day.',
              },
              {
                q: 'Is my wedding website optimized for mobile phones?',
                a: 'Yes, 100%! All our premium templates are designed mobile-first. Since over 90% of guests open invitations on their smartphones, we ensure your wedding invite website is incredibly fast, fully responsive, and looks spectacular on all devices including iOS, Android, tablets, and desktops.',
              },
              {
                q: 'How do guests find the venue location map?',
                a: 'We integrate interactive Google Maps directly into your invite. When you paste your venue map link in our editor, a clickable location pin is embedded on your page. Guests can tap it to open the location directly in their navigation app for effortless directions.',
              },
              {
                q: 'Can I share my invitation link directly on WhatsApp?',
                a: 'Yes! Once published, you will get a unique, clean link (like inviteque.com/abhishek-meera). You can copy and paste this link to share it instantly on WhatsApp, Instagram, email, SMS, or any other messaging platform.',
              },
              {
                q: 'Are there any recurring monthly subscription fees?',
                a: 'No. We believe in complete transparency. There are absolutely no subscriptions, hidden fees, or monthly hosting costs. You pay a simple, one-time flat fee of ₹999 per template, which includes 6 months of premium hosting and unlimited updates.',
              },
              {
                q: 'Can I upload our personal photos to the website?',
                a: 'Yes! Our premium templates include gorgeous cinematic story timelines and high-resolution photo galleries. You can upload your beautiful pre-wedding photoshoot or personal couple images directly from your phone or computer to showcase them to your guests.',
              },
              {
                q: 'What happens to the watermark on my website?',
                a: 'A clean, minimal preview watermark is displayed on all drafts and unpaid templates. As soon as you complete the secure payment, the watermark is instantly and automatically removed, leaving you with a polished, premium wedding website.',
              },
              {
                q: 'How secure is the checkout process?',
                a: 'Extremely secure. We partner with industry-leading payment gateways to process transactions. All checkout actions are fully encrypted, and your credit/debit card, UPI, or net banking information is never stored on our servers.',
              },
            ].map((item) => (
              <motion.div key={item.q} variants={fadeUp}>
                <details className="group rounded-card border border-iqBorder bg-iqCard px-5 py-4 shadow-luxury">
                  <summary className="cursor-pointer list-none text-sm font-bold">
                    <span className="flex items-center justify-between gap-3">
                      <span>{item.q}</span>
                      <span className="text-iqText/60 transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-iqText/70">{item.a}</p>
                </details>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 8) Footer */}
      <footer className="relative overflow-hidden border-t border-iqBorder bg-gradient-to-br from-[#5C0A14] via-[#7B0F1A] to-[#5C0A14] px-6 py-10 md:py-12 text-center md:text-left">
        {/* Subtle radial glow background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(196,151,74,0.12)_0%,transparent_70%)]" />

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          className="relative z-10 mx-auto w-full max-w-7xl"
        >
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:items-end">
            {/* Branding & Tagline */}
            <div className="flex flex-col items-center md:items-start">
              <motion.p
                variants={fadeUp}
                className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#FFF6F0]/60"
              >
                Crafted by
              </motion.p>
              <motion.div
                variants={fadeUp}
                className="mt-3"
              >
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity md:items-start">
                  <img src={logo} alt="Inviteque" className="h-14 w-auto" loading="lazy" />
                  <span className="font-parisienne text-5xl font-normal text-[#FFF6F0] md:text-6xl">
                    Inviteque
                  </span>
                </Link>
              </motion.div>
              <motion.p
                variants={fadeUp}
                className="mt-4 max-w-xs text-sm leading-relaxed text-[#FFF6F0]/60"
              >
                Create Beautiful Digital Invitations.
                <br />
                Share Love. Share Moments.
              </motion.p>
            </div>

            {/* Nav & Socials */}
            <div className="flex flex-col items-center md:items-end">
              <motion.p
                variants={fadeUp}
                className="mb-4 text-center text-sm text-[#FFF6F0]/70 md:text-right"
              >
                <span className="block text-[12px] font-semibold tracking-normal text-[#FFF6F0]/65">
                  Support
                </span>
                <a
                  href="mailto:inviteque.support@gmail.com"
                  className="mt-1 inline-block font-semibold text-[#FFF6F0]/90 hover:text-white transition-colors"
                >
                  inviteque.support@gmail.com
                </a>
              </motion.p>
              <motion.div
                variants={fadeUp}
                className="flex items-center gap-4"
              >
                {[
                  {
                    id: 'ig', label: 'Instagram', icon: (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
                    )
                  },
                  {
                    id: 'wa', label: 'WhatsApp', icon: (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.882l6.22-1.632A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.887 9.887 0 01-5.042-1.378l-.361-.214-3.742.981.999-3.648-.235-.374A9.861 9.861 0 012.106 12C2.106 6.53 6.53 2.106 12 2.106c5.471 0 9.894 4.424 9.894 9.894 0 5.471-4.423 9.894-9.894 9.894z" /></svg>
                    )
                  },
                ].map((social) => (
                  <a
                    key={social.id}
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[#FFF6F0]/80 transition-all hover:bg-white/10 hover:text-white"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </motion.div>
              <motion.div
                variants={fadeUp}
                className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold tracking-wide text-[#FFF6F0]/40 md:justify-end"
              >
                <a href="#about" className="hover:text-white transition-colors">How it Works</a>
                <a href="#templates" className="hover:text-white transition-colors">Templates</a>
                <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                <a href="#faq" className="hover:text-white transition-colors">FAQs</a>
              </motion.div>
              <motion.p
                variants={fadeUp}
                className="mt-6 text-[10px] font-medium uppercase tracking-[0.15em] text-[#FFF6F0]/20"
              >
                © {new Date().getFullYear()} Inviteque • ALL RIGHTS RESERVED
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Decorative Leaf Sprigs in corners - tighter position */}
        <div className="absolute -bottom-2 -left-2 -rotate-12 opacity-30 md:bottom-2 md:left-2">
          <svg viewBox="0 0 90 50" width="70" height="40" fill="none" stroke="#C4974A" strokeWidth="1.2" strokeLinecap="round" className="opacity-50">
            <path d="M10 42 Q35 28 80 10" />
            <path d="M22 36 Q18 22 32 20 Q28 34 22 36Z" fill="#C4974A" opacity="0.3" />
          </svg>
        </div>
        <div className="absolute -bottom-2 -right-2 rotate-12 scale-x-[-1] opacity-30 md:bottom-2 md:right-2">
          <svg viewBox="0 0 90 50" width="70" height="40" fill="none" stroke="#C4974A" strokeWidth="1.2" strokeLinecap="round" className="opacity-50">
            <path d="M10 42 Q35 28 80 10" />
            <path d="M22 36 Q18 22 32 20 Q28 34 22 36Z" fill="#C4974A" opacity="0.3" />
          </svg>
        </div>
      </footer>
    </main>
  )
}
