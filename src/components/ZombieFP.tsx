import { motion } from 'framer-motion'
import { Zombie } from '../context/GameContext'
import { projectToScreen } from '../utils/fpMath'

interface ZombieFPProps {
  zombie: Zombie
  playerYaw: number
}

export function ZombieFP({ zombie, playerYaw }: ZombieFPProps) {
  // Calculate relative angle and distance
  const dx = zombie.x - 400
  const dy = zombie.y - 300
  const distance = Math.sqrt(dx * dx + dy * dy)
  const angleToPlayer = Math.atan2(dx, -dy) // 0 = straight ahead
  const relAngle = angleToPlayer - playerYaw

  // Only render if in front of player (within ~90deg left/right)
  if (Math.abs(relAngle) > Math.PI / 2) return null

  // Project to screen (simple fake 3D)
  const { x, scale } = projectToScreen(relAngle, distance)
  const y = 320 + (1 - scale) * 120 // vertical position

  // Health bar
  const healthPct = zombie.health / zombie.maxHealth

  return (
    <motion.div
      className="absolute z-30"
      style={{
        left: `calc(50% + ${x}px)`,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: zombie.isActive ? 1 : 0.3,
        pointerEvents: 'none',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Zombie sprite (simple circle with eyes) */}
      <div className="relative">
        <div className="w-20 h-24 bg-gradient-to-b from-green-700 to-green-900 rounded-b-full border-4 border-green-800 shadow-lg flex flex-col items-center justify-end">
          <div className="flex gap-2 absolute top-6 left-1/2 -translate-x-1/2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-red-500 rounded-full" />
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-gray-800 rounded-full" />
        </div>
        {/* Health bar */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-2 bg-gray-800 rounded-full">
          <div className="h-full bg-gradient-to-r from-red-600 to-yellow-400 rounded-full" style={{ width: `${healthPct * 100}%` }} />
        </div>
      </div>
    </motion.div>
  )
}
