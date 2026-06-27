import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

const PITCH = 96;

const letterContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}
const letterAnim = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

function AnimatedTitle({ text, className, style }) {
  return (
    <motion.h2 variants={letterContainer} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.1 }} className={className} style={style}>
      {text.split('').map((char, index) => (
        <motion.span key={index} variants={letterAnim} style={{ display: 'inline-block' }}>{char === ' ' ? '\u00A0' : char}</motion.span>
      ))}
    </motion.h2>
  )
}

function EventItem({ item, index, scrollY, isDesktop }) {
  const itemY = index * PITCH;
  
  // screenY is the physical position of this item inside the frame
  const screenY = useTransform(scrollY, y => y + itemY);
  
  // Center of the frame: center values scale for desktop frame height
  const fadeStart = isDesktop ? -40 : -30;
  const fadePeak = isDesktop ? 130 : 120;
  const fadeEnd = isDesktop ? 290 : 270;
  const containerOpacity = useTransform(screenY, [fadeStart, fadePeak, fadeEnd], [0, 1, 0]);

  return (
    <motion.div 
      className={`absolute left-0 right-0 mx-auto w-[85%] ${isDesktop ? 'max-w-[360px]' : 'max-w-[340px]'} flex justify-center`}
      style={{ y: screenY, opacity: containerOpacity }}
    >
      {/* Event Card */}
      <div 
        className={`relative w-full ${isDesktop ? 'p-[14px] rounded-[22px] gap-4' : 'p-[12px] rounded-[20px] gap-3'} flex items-center bg-[#ffffff]/80 border border-[#d5b28c]/40 shadow-[0_5px_15px_rgba(0,0,0,0.04)]`}
      >
         <div className={`rounded-full flex items-center justify-center shrink-0 shadow-inner bg-[#fff0ec] text-[#8B1E2D] ${isDesktop ? 'w-[48px] h-[48px]' : 'w-[44px] h-[44px]'}`}>
           {item.icon}
         </div>
         <div>
           <div className={`${isDesktop ? 'text-[11px]' : 'text-[10px]'} font-bold tracking-[0.15em] uppercase text-[#8B1E2D] mb-1`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
             {item.time}
           </div>
           <h3 className={`${isDesktop ? 'text-[20px]' : 'text-[18px]'} font-bold text-[#5C0A14]`} style={{ fontFamily: "'Playfair Display', serif" }}>
             {item.name}
           </h3>
         </div>
      </div>
    </motion.div>
  )
}

export default function Events({ data, isDesktop }) {
  const defaultEvents = [
    {
      time: "11:00 AM",
      name: "Haldi Ceremony",
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h16c0 4.4-3.6 8-8 8s-8-3.6-8-8z" />
          <path d="M12 12V4M9 5l3-1 3 1" />
          <circle cx="7" cy="8" r="0.5" fill="currentColor" />
          <circle cx="17" cy="7" r="0.5" fill="currentColor" />
          <path d="M5 14l14 0" />
        </svg>
      )
    },
    {
      time: "04:00 PM",
      name: "Wedding Vows",
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="12" r="5" />
          <circle cx="15" cy="12" r="5" />
          <path d="M9 7l1-2 1 2" />
        </svg>
      )
    },
    {
      time: "07:00 PM",
      name: "Grand Reception",
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 15c0-4 3.5-7 7-7s7 3 7 7" />
          <path d="M12 8V6M10 6h4" />
          <path d="M3 15h18" />
          <path d="M4 17h16" />
        </svg>
      )
    }
  ]

  const dataItems = data?.items
  const items = (dataItems && dataItems.length >= 3) ? dataItems.map((item, i) => ({
    ...defaultEvents[i % defaultEvents.length], 
    time: item.time || defaultEvents[i % defaultEvents.length].time,
    name: item.name || defaultEvents[i % defaultEvents.length].name,
  })) : defaultEvents

  const displayItems = [...items, ...items, ...items, ...items, ...items, ...items]
  
  const scrollY = useMotionValue(0)
  const totalHeight = items.length * PITCH

  useEffect(() => {
    const controls = animate(scrollY, [0, -totalHeight], {
      repeat: Infinity,
      ease: "linear",
      duration: items.length * 3.5,
    })
    return () => controls.stop()
  }, [totalHeight, scrollY, items.length])

  if (!data) return null

  return (
    <section 
      id={data.id || 'events'} 
      className="w-full px-4 py-24 relative flex flex-col items-center justify-center overflow-hidden"
      style={{ 
        backgroundColor: '#fff6f2',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 40c-5-10-15-15-20-15 0 10 10 20 20 20 5-10 15-15 20-15 0 10-10 20-20 20z' fill='%238B1E2D' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`
      }}
    >
      
      {/* ── Title Section ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center z-10 mb-12"
      >
        <div className="flex items-center gap-2 mb-3 opacity-60">
          <div className="w-1 h-1 rotate-45 bg-[#b58372]"></div>
          <svg width="24" height="10" viewBox="0 0 24 10" fill="none">
            <path d="M12 0C12 5 7 5 0 5C7 5 12 5 12 10C12 5 17 5 24 5C17 5 12 5 12 0Z" fill="#b58372"/>
          </svg>
          <div className="w-1 h-1 rotate-45 bg-[#b58372]"></div>
        </div>

        <AnimatedTitle 
          text="WEDDING SCHEDULE"
          style={{ fontFamily: "'Cinzel', serif", color: '#721c24', fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 700, letterSpacing: '0.08em' }}
        />

        <div className="flex items-center gap-3 mt-3 opacity-70">
          <div className="w-1.5 h-1.5 rotate-45 bg-[#b58372]"></div>
          <p style={{ fontFamily: "'Montserrat', sans-serif", color: '#a07870', fontSize: '10px', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            Celebrating Love, Together
          </p>
          <div className="w-1.5 h-1.5 rotate-45 bg-[#b58372]"></div>
        </div>
      </motion.div>

      {/* ── Roller Layout (Same auto moving animation for both Mobile & Desktop) ── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className={`relative w-full ${isDesktop ? 'max-w-[420px] h-[360px]' : 'max-w-[300px] h-[340px]'} flex justify-center items-center mt-6 z-10`}
      >
        {/* Inner Glass Frame */}
        <div 
          className="relative w-full h-full rounded-[30px] bg-gradient-to-b from-[#fdf8f7]/60 via-transparent to-[#fdf8f7]/60 border-[2px] border-[#d5b28c]/40 overflow-hidden shadow-[inset_0_20px_50px_rgba(0,0,0,0.03),_0_20px_40px_rgba(139,30,45,0.06)] backdrop-blur-sm"
        >
          {/* The Roller Items Track */}
          <div className="absolute inset-0">
             {displayItems.map((item, index) => (
               <EventItem key={index} item={item} index={index} scrollY={scrollY} isDesktop={isDesktop} />
             ))}
          </div>
          
          {/* Top/Bottom Ambient Fade Overlays */}
          <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-[#fff6f2] via-[#fff6f2]/80 to-transparent pointer-events-none z-20 rounded-t-[30px]" />
          <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[#fff6f2] via-[#fff6f2]/80 to-transparent pointer-events-none z-20 rounded-b-[30px]" />
        </div>
      </motion.div>

    </section>
  )
}
