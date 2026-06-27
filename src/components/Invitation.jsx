import { motion } from 'framer-motion'
const letterImg = "https://res.cloudinary.com/djbxuk2xr/image/upload/f_auto,q_auto/v1779029566/o5fazwrbkcpjtrcpt1bs.png"

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
    <motion.p variants={letterContainer} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.1 }} className={className} style={style}>
      {text.split('').map((char, index) => (
        <motion.span key={index} variants={letterAnim} style={{ display: 'inline-block' }}>{char === ' ' ? '\u00A0' : char}</motion.span>
      ))}
    </motion.p>
  )
}

function pseudoRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function ScatterText({ text }) {
  return (
    <div>
      {text.split('').map((char, index) => {
        const seedX = index * 123.456;
        const seedY = index * 789.101;
        const seedRot = index * 345.678;
        const randX = (pseudoRandom(seedX) - 0.5) * 80;
        const randY = (pseudoRandom(seedY) - 0.5) * 80;
        const randRot = (pseudoRandom(seedRot) - 0.5) * 90;
        return (
          <motion.span 
            key={index} 
            initial={{ opacity: 0, x: randX, y: randY, rotate: randRot }}
            whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1, delay: index * 0.04 + 0.6, type: "spring", stiffness: 100, damping: 10 }}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {char}
          </motion.span>
        )
      })}
    </div>
  )
}

export default function Invitation({ data }) {
  if (!data) return null

  // Fallback text if data.message is empty
  const defaultMessage = "We are excited to invite you to celebrate our wedding with us. This special day would not be complete without your presence."

  const paragraphs = String(data.message || defaultMessage)
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <section
      id={data.id}
      className="relative w-full overflow-hidden flex flex-col justify-center items-center"
      style={{
        backgroundColor: '#fff6f2',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c-2.5-5-10-5-10 0 0 5 7.5 5 10 10 2.5-5 10-5 10 0 0-5-7.5-5-10-10z' fill='%238B1E2D' fill-opacity='0.04' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        paddingTop: '60px',
        paddingBottom: '20px'
      }}
    >

      {/* Moved Text to top of section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        className="text-center mb-10 relative z-10"
      >
        <AnimatedTitle 
          text="Our story, our journey,"
          style={{ fontFamily: "'Parisienne', cursive", fontSize: 'clamp(28px, 8vw, 36px)', color: '#8B1E2D', margin: 0, lineHeight: 1.1 }}
        />
        <AnimatedTitle 
          text="ours forever"
          style={{ fontFamily: "'Parisienne', cursive", fontSize: 'clamp(42px, 12vw, 54px)', color: '#8B1E2D', margin: 0, lineHeight: 1.1 }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-[95%] max-w-[550px]"
      >
        {/* The 3D Letter Image */}
        <img
          src={letterImg}
          alt="Invitation Letter"
          className="w-full block h-auto -mt-10"
          style={{
            filter: 'drop-shadow(0px 35px 50px rgba(255, 255, 255, 0.35)) drop-shadow(0px 12px 18px rgba(0,0,0,0.25))'
          }}
        />

        {/* Text Overlay - Positioned perfectly within the card's visual bounds */}
        <div
          className="absolute flex flex-col items-center justify-center text-center"
          style={{
            top: '35%',       // Safely below the top floral decoration
            left: '21%',
            right: '21%',
            bottom: '59%',    // Safely above the wax seal
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1.4, delay: 0.5 }}
            className="w-full h-full flex flex-col items-center justify-center"
          >


            <h2
              style={{
                fontFamily: "'Cinzel', serif",
                color: '#8B1E2D',
                fontSize: 'clamp(10px, 3.2vw, 16px)',
                fontWeight: 600,
                letterSpacing: '0.12em',
                lineHeight: 1.15,
                marginTop: '6px',
              }}
            >
              <ScatterText text="DEAR" />
              <ScatterText text="FAMILY & FRIENDS" />
            </h2>

            {/* Divider Heart */}
            <div className="flex items-center justify-center gap-2 my-[6px] mx-auto w-full max-w-[100px]">
              <div className="h-[1px] flex-1" style={{ background: 'rgba(139, 30, 45, 0.25)' }} />
              <span style={{ color: '#8B1E2D', fontSize: '8px', opacity: 0.9 }}>♥</span>
              <div className="h-[1px] flex-1" style={{ background: 'rgba(139, 30, 45, 0.25)' }} />
            </div>

            <div
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: '#5C0A14',
                fontSize: 'clamp(8px, 2vw, 11px)',
                lineHeight: 1.5,
                marginTop: '0px',
                fontWeight: 500,
                opacity: 0.85
              }}
            >
              {paragraphs.map((p, idx) => (
                <p key={idx} style={{ marginBottom: idx === paragraphs.length - 1 ? 0 : '6px' }}>
                  {p}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

    </section>
  )
}
