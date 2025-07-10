import { useRef, useEffect, useState } from 'react'

export function useFPCamera() {
  // Yaw: left/right, Pitch: up/down (for now, only yaw)
  const [yaw, setYaw] = useState(0)
  const [pitch, setPitch] = useState(0)
  const pointerLockRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === pointerLockRef.current) {
        setYaw((prev) => prev + e.movementX * 0.002)
        setPitch((prev) => Math.max(-Math.PI/4, Math.min(Math.PI/4, prev - e.movementY * 0.002)))
      }
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Click to lock pointer
  const requestPointerLock = () => {
    if (pointerLockRef.current) {
      pointerLockRef.current.requestPointerLock()
    }
  }

  return { yaw, pitch, pointerLockRef, requestPointerLock }
}
