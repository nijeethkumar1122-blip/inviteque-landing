import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
const heroBg = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1780830584/bevo6p9kp87xs9glyczu.png"
const petalImg = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1779029563/kozuh0rafoxa9zwysfjq.png"

/* ─────────────────────────────────────────
   Animation variants
───────────────────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

const nameReveal = {
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
  show: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 2.0, ease: [0.22, 1, 0.36, 1] },
  },
}

const nameLetters = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.12 } },
}

const nameLetter = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
}

const ampReveal = {
  hidden: { opacity: 0, scale: 0.7 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'backOut' } },
}

/* ─────────────────────────────────────────
   Falling Petals
───────────────────────────────────────── */
const petalConfig = Array.from({ length: 14 }).map((_, i) => {
  const isLeft = i % 2 === 0;
  const leftPos = isLeft ? Math.random() * 20 : 80 + Math.random() * 20; // 0-20% or 80-100%
  const duration = 6 + Math.random() * 8; // 6 to 14 seconds
  const delay = Math.random() * 5;
  const size = 15 + Math.random() * 20; // sizes between 15 and 35
  const randX1 = Math.random() * 60 - 30;
  const randX2 = Math.random() * 60 - 30;
  return { left: leftPos, duration, delay, size, randX1, randX2 };
});

function FallingPetals() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ height: '100svh' }}>
      {petalConfig.map((p, i) => (
        <motion.img
          key={i}
          src={petalImg}
          alt=""
          className="absolute top-[-10%]"
          style={{ left: `${p.left}%`, width: p.size, height: 'auto', opacity: 0.8 }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, p.randX1, p.randX2],
            rotate: [0, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   Monogram Badge — diamond frame
───────────────────────────────────────── */
function MonogramBadge({ groomInitial = 'G', brideInitial = 'B' }) {
  return (
    <motion.div variants={fadeUp} className="flex flex-col items-center">
      <svg viewBox="0 0 80 80" width="54" height="54" fill="none" aria-hidden="true">
        <polygon points="40,4 76,40 40,76 4,40"
          stroke="#7B0F1A" strokeWidth="1.3" fill="none" opacity="0.55" />
        <polygon points="40,12 68,40 40,68 12,40"
          stroke="#7B0F1A" strokeWidth="0.7" fill="none" opacity="0.28" />
        <circle cx="40" cy="4" r="2" fill="#7B0F1A" opacity="0.4" />
        <circle cx="76" cy="40" r="2" fill="#7B0F1A" opacity="0.4" />
        <circle cx="40" cy="76" r="2" fill="#7B0F1A" opacity="0.4" />
        <circle cx="4" cy="40" r="2" fill="#7B0F1A" opacity="0.4" />
        <text x="40" y="36" textAnchor="middle" fontFamily="'Cinzel', serif"
          fontSize="12" fontWeight="700" fill="#7B0F1A" opacity="0.88">{groomInitial}</text>
        <text x="40" y="52" textAnchor="middle" fontFamily="'Cinzel', serif"
          fontSize="12" fontWeight="700" fill="#7B0F1A" opacity="0.88">{brideInitial}</text>
        <text x="40" y="44" textAnchor="middle" fontFamily="serif"
          fontSize="7" fill="#7B0F1A" opacity="0.38">✦</text>
      </svg>
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   Decorative heart divider
───────────────────────────────────────── */
function HeartRule({ maxW = 160 }) {
  return (
    <motion.div
      variants={fadeUp}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 8, width: '100%', maxWidth: maxW
      }}
    >
      <div style={{ height: 1, flex: 1, background: 'rgba(123,15,26,0.28)' }} />
      <span style={{ fontSize: 8, color: '#7B0F1A', opacity: 0.55 }}>♥</span>
      <div style={{ height: 1, flex: 1, background: 'rgba(123,15,26,0.28)' }} />
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   Date row — AUGUST | 18 | 2026
───────────────────────────────────────── */
function DateRow({ dateLine, isDesktop }) {
  const parts = String(dateLine || '').trim().split(/\s+/)
  let day = '', month = '', year = ''
  if (parts.length >= 3) {
    day = parts[0]
    month = parts.slice(1, -1).join(' ').toUpperCase()
    year = parts[parts.length - 1]
  }
  return (
    <motion.div variants={fadeUp}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* MONTH */}
      <div style={{ paddingRight: 14 }}>
        <span style={{
          fontFamily: "'Cinzel', serif",
          fontSize: isDesktop ? '14px' : 'clamp(8px, 2.4vw, 11px)',
          letterSpacing: '0.2em',
          color: '#7B0F1A',
          opacity: 0.75,
        }}>{month}</span>
      </div>
      {/* Vertical divider */}
      <div style={{ width: 1, height: 32, background: '#7B0F1A', opacity: 0.28 }} />
      {/* DAY */}
      <div style={{ paddingLeft: 14, paddingRight: 14 }}>
        <span style={{
          fontFamily: "'Cinzel', serif",
          fontSize: isDesktop ? '48px' : 'clamp(26px, 8.5vw, 42px)',
          fontWeight: 700,
          lineHeight: 1,
          color: '#7B0F1A',
        }}>{day}</span>
      </div>
      {/* Vertical divider */}
      <div style={{ width: 1, height: 32, background: '#7B0F1A', opacity: 0.28 }} />
      {/* YEAR */}
      <div style={{ paddingLeft: 14 }}>
        <span style={{
          fontFamily: "'Cinzel', serif",
          fontSize: isDesktop ? '14px' : 'clamp(8px, 2.4vw, 11px)',
          letterSpacing: '0.2em',
          color: '#7B0F1A',
          opacity: 0.75,
        }}>{year}</span>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   Pin icon
───────────────────────────────────────── */
function PinIcon() {
  return (
    <svg viewBox="0 0 20 26" width="12" height="16" fill="none" aria-hidden="true">
      <path d="M10 1C6.13 1 3 4.13 3 8c0 5.25 7 16 7 16s7-10.75 7-16c0-3.87-3.13-7-7-7z"
        stroke="#7B0F1A" strokeWidth="1.4" fill="#7B0F1A" fillOpacity="0.12" />
      <circle cx="10" cy="8" r="2.5" fill="#7B0F1A" opacity="0.7" />
    </svg>
  )
}

/* ─────────────────────────────────────────
   Main Hero
───────────────────────────────────────── */
export default function Hero({ data, scrollContainerRef, isDesktop }) {
  const { scrollY } = useScroll(
    scrollContainerRef ? { container: scrollContainerRef } : undefined,
  )
  const rawY = useTransform(scrollY, [0, 800], ['0%', '-10%'])
  const bgY = useSpring(rawY, { stiffness: 55, damping: 18 })

  if (!data) return null

  const currentHeroBg = isDesktop
    ? "https://res.cloudinary.com/djbxuk2xr/image/upload/v1782033902/nelfh17u4fep6v8ksoei.webp"
    : heroBg

  return (
    <section
      id={data.id}
      className="relative w-full overflow-hidden"
      style={isDesktop ? { aspectRatio: '1448 / 1086', minHeight: 'auto', background: '#FFF0EC' } : { minHeight: 'calc(100svh + 20px)', background: '#FFF0EC' }}
    >
      {/* ── Parallax background — no overlay ── */}
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: bgY, scale: 1.3, transformOrigin: 'center' }}
      >
        <img
          src={currentHeroBg}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          style={{ objectPosition: 'center' }}
          loading="eager"
        />
      </motion.div>

      <FallingPetals />

      {/* ── Content: locked to the sky/blossom band (top ~52 % of viewport) ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center"
        style={{
          paddingTop: 'clamp(20px, 5svh, 48px)',
          paddingBottom: 'clamp(10px, 2svh, 24px)',
          paddingLeft: 'clamp(20px, 6vw, 52px)',
          paddingRight: 'clamp(20px, 6vw, 52px)',
        }}
      >

        {/* Monogram — initials driven by data */}
        <MonogramBadge
          groomInitial={(data.groomName?.[0] ?? 'G').toUpperCase()}
          brideInitial={(data.brideName?.[0] ?? 'B').toUpperCase()}
        />

        {/* SAVE THE DATE */}
        <motion.p
          variants={fadeUp}
          style={{
            marginTop: 4,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: isDesktop ? '14px' : 'clamp(8.5px, 1.4svh, 13px)',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#7B0F1A',
            opacity: 0.95,
          }}
        >
          {data.title || 'Save the Date'}
        </motion.p>

        {/* Divider below SAVE THE DATE */}
        <div style={{ marginTop: 10, width: '100%', maxWidth: 130 }}>
          <HeartRule maxW={130} />
        </div>

        {/* ── Groom name ── */}
        <motion.div variants={nameReveal} style={{ marginTop: isDesktop ? 26 : 10, position: 'relative' }}>
          <motion.span
            variants={nameLetters}
            style={{
              fontFamily: "'Cintarini', 'Parisienne', 'Spectral', cursive",
              fontSize: isDesktop ? 'clamp(30px, 4.2vw, 90px)' : 'clamp(20px, 10svh, 60px)',
              fontWeight: 100,
              lineHeight: 0.92,
              color: '#7B0F1A',
              display: 'block',
              textShadow: '0 2px 14px rgba(123,15,26,0.13)',
              whiteSpace: 'nowrap',
            }}
          >
            {String(data.groomName || '')
              .split('')
              .map((ch, idx) => (
                <motion.span
                  key={`${ch}-${idx}`}
                  variants={nameLetter}
                  style={{ display: 'inline-block' }}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </motion.span>
              ))}
          </motion.span>

          {/* Glassy reflection overlay */}
          <motion.span
            animate={{ backgroundPosition: ['100% center', '-200% center'] }}
            transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
            style={{
              fontFamily: "'Cintarini', 'Parisienne', 'Spectral', cursive",
              fontSize: isDesktop ? 'clamp(30px, 4.2vw, 90px)' : 'clamp(20px, 10svh, 60px)',
              fontWeight: 100,
              lineHeight: 0.92,
              whiteSpace: 'nowrap',
              position: 'absolute',
              inset: '-35px -20px',
              padding: '35px 20px',
              pointerEvents: 'none',
              background: 'linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.48) 50%, transparent 60%)',
              backgroundSize: '200% 250%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              zIndex: 2,
              display: 'block',
            }}
            aria-hidden="true"
          >
            {String(data.groomName || '')
              .split('')
              .map((ch, idx) => (
                <span
                  key={`${ch}-${idx}`}
                  style={{ display: 'inline-block' }}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
          </motion.span>
        </motion.div>

        {/* & */}
        <motion.div variants={ampReveal} style={{ marginTop: isDesktop ? 10 : -2 }}>
          <span style={{
            fontFamily: "'Parisienne', 'Spectral', cursive",
            fontSize: isDesktop ? 'clamp(30px, 4.2vw, 90px)' : 'clamp(20px, 10svh, 60px)',
            fontWeight: 100,
            lineHeight: 1,
            color: '#7B0F1A',
            opacity: 0.88,
            display: 'block',
          }}>
            &amp;
          </span>
        </motion.div>

        {/* ── Bride name ── */}
        <motion.div variants={nameReveal} style={{ marginTop: isDesktop ? 10 : -4, position: 'relative' }}>
          <motion.span
            variants={nameLetters}
            style={{
              fontFamily: "'Cintarini', 'Parisienne', 'Spectral', cursive",
              fontSize: isDesktop ? 'clamp(30px, 4.2vw, 90px)' : 'clamp(20px, 10svh, 60px)',
              fontWeight: 100,
              lineHeight: 0.92,
              color: '#7B0F1A',
              display: 'block',
              textShadow: '0 2px 14px rgba(123,15,26,0.13)',
              whiteSpace: 'nowrap',
            }}
          >
            {String(data.brideName || '')
              .split('')
              .map((ch, idx) => (
                <motion.span
                  key={`${ch}-${idx}`}
                  variants={nameLetter}
                  style={{ display: 'inline-block' }}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </motion.span>
              ))}
          </motion.span>

          {/* Glassy reflection overlay */}
          <motion.span
            animate={{ backgroundPosition: ['200% center', '-200% center'] }}
            transition={{ repeat: Infinity, duration: 7, ease: 'linear', delay: 1 }}
            style={{
              fontFamily: "'Cintarini', 'Parisienne', 'Spectral', cursive",
              fontSize: isDesktop ? 'clamp(30px, 4.2vw, 90px)' : 'clamp(20px, 10svh, 60px)',
              fontWeight: 100,
              lineHeight: 0.92,
              whiteSpace: 'nowrap',
              position: 'absolute',
              inset: '-35px -20px',
              padding: '35px 20px',
              pointerEvents: 'none',
              background: 'linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.48) 50%, transparent 60%)',
              backgroundSize: '200% 250%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              zIndex: 2,
              display: 'block',
            }}
            aria-hidden="true"
          >
            {String(data.brideName || '')
              .split('')
              .map((ch, idx) => (
                <span
                  key={`${ch}-${idx}`}
                  style={{ display: 'inline-block' }}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
          </motion.span>
        </motion.div>

        {/* ARE GETTING MARRIED */}
        <motion.div
          variants={fadeUp}
          style={{
            marginTop: isDesktop ? 24 : 4, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 20, width: '100%'
          }}
        >
          <div style={{ width: '100%', maxWidth: 170 }}>
            <HeartRule maxW={170} />
          </div>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: isDesktop ? '14px' : 'clamp(7px, 1.2svh, 10.5px)',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#7B0F1A',
            opacity: 0.85,
          }}>
            {data.subtitle || 'Are Getting Married'}
          </p>
        </motion.div>

        {/* ── Date row ── */}
        <div style={{ marginTop: isDesktop ? 12 : 3 }}>
          <DateRow dateLine={data.dateLine} isDesktop={isDesktop} />
        </div>

        {/* Day of week */}
        <motion.div variants={fadeUp} style={{ marginTop: isDesktop ? 8 : 0 }}>
          <span style={{
            fontFamily: "'Parisienne', cursive",
            fontSize: isDesktop ? '34px' : 'clamp(18px, 4.5svh, 30px)',
            fontWeight: 400,
            lineHeight: 1.1,
            color: '#7B0F1A',
            opacity: 0.95,
            display: 'block',
          }}>
            {data.dayOfWeek}
          </span>
          <svg viewBox="0 0 90 12" width="55" aria-hidden="true" fill="none"
            style={{ display: 'block', margin: '0 auto' }}>
            <path d="M5 6 Q22 1 45 6 Q68 11 85 6"
              stroke="#7B0F1A" strokeWidth="1" strokeLinecap="round" opacity="0.2" />
          </svg>
        </motion.div>

        {/* ── Venue ── */}
        <motion.div
          variants={fadeUp}
          style={{
            marginTop: 4, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 2
          }}
        >
          <PinIcon />

          {/* Venue details rendered dynamically from address parts */}
          {data.addressParts && data.addressParts.length > 0 ? (
            <div className="flex flex-col items-center">
              <p style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                fontSize: isDesktop ? '16px' : 'clamp(9px, 1.5svh, 13px)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#7B0F1A',
                marginTop: 2,
                lineHeight: 1.2,
                textAlign: 'center',
                padding: '0 10px'
              }}>
                {data.addressParts[0]}
              </p>
              {data.addressParts.length > 1 && (
                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: isDesktop ? '12px' : 'clamp(7px, 1.1svh, 9.5px)',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#7B0F1A',
                  opacity: 0.8,
                  textAlign: 'center',
                  padding: '0 20px',
                  marginTop: '4px'
                }}>
                  {data.addressParts.slice(1).join(', ')}
                </p>
              )}
            </div>
          ) : (
            <>
              <p style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                fontSize: isDesktop ? '16px' : 'clamp(9px, 1.5svh, 13px)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#7B0F1A',
                marginTop: 2,
                lineHeight: 1.2,
              }}>
                {data.venueName}
              </p>
              <p style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
                fontSize: isDesktop ? '12px' : 'clamp(7px, 1.1svh, 9.5px)',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#7B0F1A',
                opacity: 0.8,
              }}>
                {data.venueCity}
              </p>
            </>
          )}

          {data.hashtag && (
            <p style={{
              fontFamily: "'Parisienne', cursive",
              fontSize: isDesktop ? '22px' : 'clamp(12px, 2.8svh, 18px)',
              fontWeight: 400,
              color: '#7B0F1A',
              opacity: 0.7,
              marginTop: 1,
            }}>
              {data.hashtag}
            </p>
          )}
        </motion.div>

      </motion.div>



      {/* ── Scroll button ── */}
      <motion.button
        type="button"
        onClick={() => {
          if (data.scrollToId) {
            const el = document.getElementById(data.scrollToId)
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          } else {
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
          }
        }}
        aria-label="Scroll down"
        className="absolute z-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ bottom: 'clamp(20px, 4vh, 40px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0 }}
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: '1.5px solid rgba(123,15,26,0.3)',
            background: 'rgba(255,255,255,0.58)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg viewBox="0 0 18 11" width="13" height="8" fill="none" aria-hidden="true">
            <path d="M1 1.5 L9 9.5 L17 1.5"
              stroke="#7B0F1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              opacity="0.55"
            />
          </svg>
        </motion.div>
      </motion.button>
    </section>
  )
}
