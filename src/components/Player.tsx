import { motion } from 'framer-motion'

interface PlayerProps {
  x: number
  y: number
  angle: number
  health: number
}

export function Player({ x, y, angle, health }: PlayerProps) {
  const healthPercentage = health / 100

  return (
    <motion.div
      className="absolute z-20"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        rotate: (angle * 180) / Math.PI,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {/* Player body */}
      <div className="relative">
        {/* Main body */}
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full border-2 border-blue-300 shadow-lg">
          {/* Player direction indicator */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-yellow-300" />
        </div>
        
        {/* Health indicator */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded-full"
            animate={{ width: `${healthPercentage * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      
      {/* Player shadow */}
      <div 
        className="absolute w-6 h-6 bg-black/20 rounded-full blur-sm"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) translateY(2px)',
        }}
      />
    </motion.div>
  )
}