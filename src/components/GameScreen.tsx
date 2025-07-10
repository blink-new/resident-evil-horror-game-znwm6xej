import { useEffect, useState, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { RoomFP } from './RoomFP'
import { ZombieFP } from './ZombieFP'
import { PlayerGun } from './PlayerGun'
import { useFPCamera } from '../hooks/useFPCamera'
import { useGameControls } from '../hooks/useGameControls'
import { spawnZombies, updateZombieAI } from '../utils/zombieUtils'
import { useToast } from '../hooks/use-toast'

interface GameScreenProps {
  onGameOver: () => void
}

export function GameScreen({ onGameOver }: GameScreenProps) {
  const { state, updatePlayer, updateZombies, damagePlayer, dispatch, addScore } = useGame()
  const { player, zombies, difficulty } = state
  const [shooting, setShooting] = useState(false)
  const { toast } = useToast()
  const { keys } = useGameControls()
  const { yaw, pointerLockRef, requestPointerLock } = useFPCamera()

  const hasSpawned = useRef<{ [key: string]: boolean }>({})

  // Initialize zombies when game starts or difficulty changes
  useEffect(() => {
    if (!hasSpawned.current[difficulty]) {
      if (zombies.length === 0) {
        const initialZombies = spawnZombies(3, difficulty)
        updateZombies(initialZombies)
        hasSpawned.current[difficulty] = true
      }
    }
    // eslint-disable-next-line
  }, [difficulty])

  // Handle shooting
  const handleShoot = () => {
    if (player.ammo <= 0) {
      toast({
        title: "Out of ammo!",
        description: "Find more ammunition to continue fighting.",
        variant: "destructive",
      })
      return
    }
    setShooting(true)
    setTimeout(() => setShooting(false), 120)
    dispatch({ type: 'USE_AMMO', payload: 1 })
    // Check if a zombie is in the center (hit scan)
    const hitZombie = zombies.find(z => {
      // Project zombie to screen
      const dx = z.x - 400
      const dy = z.y - 300
      const distance = Math.sqrt(dx * dx + dy * dy)
      const angleToPlayer = Math.atan2(dx, -dy)
      const relAngle = angleToPlayer - yaw
      return Math.abs(relAngle) < 0.18 && distance < 400 && z.isActive
    })
    if (hitZombie) {
      // Damage zombie
      const newZombies = zombies.map(z =>
        z.id === hitZombie.id ? { ...z, health: Math.max(0, z.health - 50), isActive: z.health - 50 > 0 } : z
      )
      updateZombies(newZombies)
      addScore(50)
    }
  }

  // Mouse click to shoot (when pointer locked)
  useEffect(() => {
    const handleMouseDown = () => {
      if (document.pointerLockElement === pointerLockRef.current) {
        handleShoot()
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [player.ammo, zombies, yaw])

  // WASD movement (forward/back/strafe)
  useEffect(() => {
    const speed = 4
    let { x, y } = player
    const angle = yaw
    if (keys.w) {
      x += Math.sin(angle) * speed
      y -= Math.cos(angle) * speed
    }
    if (keys.s) {
      x -= Math.sin(angle) * speed
      y += Math.cos(angle) * speed
    }
    if (keys.a) {
      x -= Math.cos(angle) * speed
      y -= Math.sin(angle) * speed
    }
    if (keys.d) {
      x += Math.cos(angle) * speed
      y += Math.sin(angle) * speed
    }
    // Clamp to room
    x = Math.max(100, Math.min(700, x))
    y = Math.max(100, Math.min(500, y))
    updatePlayer({ x, y })
  }, [keys, yaw])

  // Zombie AI
  useEffect(() => {
    const updatedZombies = updateZombieAI(zombies, { x: player.x, y: player.y }, difficulty)
    updateZombies(updatedZombies)
    // Check for zombie attacks
    const closeZombie = zombies.find(z => {
      const dx = player.x - z.x
      const dy = player.y - z.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      return dist < 60 && z.isActive
    })
    if (closeZombie) {
      damagePlayer(10)
      if (player.health - 10 <= 0) {
        onGameOver()
      }
    }
    // Spawn new zombies
    if (Math.random() < 0.01 * (difficulty === 'easy' ? 0.5 : difficulty === 'hard' ? 2 : 1)) {
      const newZombies = spawnZombies(1, difficulty)
      updateZombies([...zombies, ...newZombies])
    }
  }, [player, zombies, difficulty, updateZombies, damagePlayer, onGameOver])

  return (
    <div
      ref={pointerLockRef}
      className="relative w-full h-screen bg-black overflow-hidden cursor-crosshair"
      tabIndex={0}
      onClick={requestPointerLock}
    >
      <RoomFP yaw={yaw} />
      <AnimatePresence>
        {zombies.map(zombie => (
          zombie.isActive && <ZombieFP key={zombie.id} zombie={zombie} playerYaw={yaw} />
        ))}
      </AnimatePresence>
      <PlayerGun shooting={shooting} />
    </div>
  )
}