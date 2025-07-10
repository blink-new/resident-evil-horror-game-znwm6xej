import { useState, useEffect } from 'react'

interface Keys {
  w: boolean
  a: boolean
  s: boolean
  d: boolean
}

interface MousePosition {
  x: number
  y: number
}

export function useGameControls() {
  const [keys, setKeys] = useState<Keys>({
    w: false,
    a: false,
    s: false,
    d: false,
  })
  
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key in keys) {
        setKeys(prev => ({ ...prev, [key]: true }))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key in keys) {
        setKeys(prev => ({ ...prev, [key]: false }))
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return { keys, mousePosition }
}