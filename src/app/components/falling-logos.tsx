'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface Logo {
  id: number
  x: number
  y: number
  rotation: number
  speed: number
  size: number
}

export default function FallingLogos() {
  const [logos, setLogos] = useState<Logo[]>([])

  useEffect(() => {
    const createLogo = (): Logo => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: -20,
      rotation: Math.random() * 360,
      speed: 0.3 + Math.random() * 0.4,
      size: 20 + Math.random() * 30
    })

    setLogos(Array.from({ length: 10 }, createLogo))

    const animate = () => {
      setLogos(prevLogos => {
        return prevLogos.map(logo => ({
          ...logo,
          y: logo.y + logo.speed,
          rotation: logo.rotation + 0.5
        })).filter(logo => logo.y < 120)
          .concat(Array.from({ length: Math.max(0, 10 - prevLogos.length) }, createLogo))
      })
    }

    const intervalId = setInterval(animate, 33)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <AnimatePresence>
        {logos.map(logo => (
          <motion.div
            key={logo.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              left: `${logo.x}%`,
              top: `${logo.y}%`,
            }}
          >
            <motion.div
              animate={{ rotate: logo.rotation }}
              transition={{ type: 'tween', duration: 0.5 }}
            >
              <Image
                src="/logo.png"
                alt=""
                width={Math.round(logo.size)}
                height={Math.round(logo.size)}
                className="opacity-30 mix-blend-screen"
              />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

