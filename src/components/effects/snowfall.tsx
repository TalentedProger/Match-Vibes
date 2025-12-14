'use client'

import { useEffect, useRef, useMemo } from 'react'

interface Snowflake {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  wobble: number
  wobbleSpeed: number
}

interface SnowfallProps {
  /** Number of snowflakes */
  count?: number
  /** Minimum snowflake size in pixels */
  minSize?: number
  /** Maximum snowflake size in pixels */
  maxSize?: number
  /** Minimum fall speed */
  minSpeed?: number
  /** Maximum fall speed */
  maxSpeed?: number
  /** Wind effect intensity (-1 to 1) */
  wind?: number
}

export function Snowfall({
  count = 50,
  minSize = 3,
  maxSize = 8,
  minSpeed = 0.5,
  maxSpeed = 2,
  wind = 0.2,
}: SnowfallProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const snowflakesRef = useRef<Snowflake[]>([])
  const animationRef = useRef<number | null>(null)
  const timeRef = useRef(0)

  // Initialize snowflakes
  const initSnowflakes = useMemo(() => {
    return (width: number, height: number): Snowflake[] => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: minSize + Math.random() * (maxSize - minSize),
        speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
        opacity: 0.4 + Math.random() * 0.6,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.01 + Math.random() * 0.03,
      }))
    }
  }, [count, minSize, maxSize, minSpeed, maxSpeed])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight

    // Set canvas size
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.scale(dpr, dpr)
    }

    setCanvasSize()
    snowflakesRef.current = initSnowflakes(width, height)

    // Handle resize
    const handleResize = () => {
      setCanvasSize()
      // Reinitialize snowflakes on resize
      snowflakesRef.current = initSnowflakes(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Animation loop
    const animate = () => {
      timeRef.current += 1

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Update and draw snowflakes
      snowflakesRef.current.forEach(flake => {
        // Update position
        flake.wobble += flake.wobbleSpeed
        flake.y += flake.speed
        flake.x += Math.sin(flake.wobble) * 0.5 + wind

        // Wrap around screen
        if (flake.y > height + flake.size) {
          flake.y = -flake.size
          flake.x = Math.random() * width
        }

        if (flake.x > width + flake.size) {
          flake.x = -flake.size
        } else if (flake.x < -flake.size) {
          flake.x = width + flake.size
        }

        // Draw snowflake with glow effect
        ctx.save()

        // Outer glow
        ctx.beginPath()
        ctx.arc(flake.x, flake.y, flake.size * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity * 0.1})`
        ctx.fill()

        // Main snowflake
        ctx.beginPath()
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
        ctx.fill()

        // Inner bright spot
        ctx.beginPath()
        ctx.arc(flake.x, flake.y, flake.size * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, flake.opacity + 0.3)})`
        ctx.fill()

        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initSnowflakes, wind])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      aria-hidden="true"
    />
  )
}
