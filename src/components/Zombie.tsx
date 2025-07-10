import { motion } from 'framer-motion'

interface ZombieProps {
  x: number
  y: number
  health: number
  maxHealth: number
  isActive: boolean
}

export function Zombie({ x, y, health, maxHealth, isActive }: ZombieProps) {
  if (!isActive) return null

  const healthPercentage = health / maxHealth
  const isDamaged = healthPercentage < 0.5

  return (
    <motion.div
      className="absolute z-10"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        rotate: isDamaged ? [0, -2, 2, -2, 0] : 0
      }}
      exit={{ 
        scale: 0, 
        opacity: 0,
        rotate: 180,
        y: y + 20
      }}
      transition={{ 
        duration: 0.5,
        rotate: isDamaged ? { duration: 0.3, repeat: Infinity } : { duration: 0 }
      }}
    >
      {/* Zombie body */}
      <div className="relative">
        {/* Main body */}
        <div className={`w-6 h-6 bg-gradient-to-br from-green-700 to-green-900 rounded-full border-2 border-green-600 shadow-lg ${isDamaged ? 'animate-pulse' : ''}`}>
          {/* Zombie eyes */}
          <div className="absolute top-1 left-1 w-1 h-1 bg-red-500 rounded-full" />
          <div className="absolute top-1 right-1 w-1 h-1 bg-red-500 rounded-full" />
        </div>
        
        {/* Health indicator */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gray-800 rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-red-600 to-yellow-500 rounded-full"
            animate={{ width: `${healthPercentage * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* Zombie arms */}
        <div className="absolute -left-1 top-1 w-1 h-2 bg-green-800 rounded-full transform -rotate-12" />
        <div className="absolute -right-1 top-1 w-1 h-2 bg-green-800 rounded-full transform rotate-12" />
      </div>
      
      {/* Zombie shadow */}
      <div 
        className="absolute w-4 h-4 bg-black/30 rounded-full blur-sm"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) translateY(2px)',
        }}
      />
      
      {/* Damage effect */}
      {isDamaged && (
        <motion.div
          className="absolute inset-0 bg-red-500 rounded-full"
          animate={{ opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  )
}