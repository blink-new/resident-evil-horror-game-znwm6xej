import { motion } from 'framer-motion'
import { Heart, Zap, Key, Skull } from 'lucide-react'
import { useGame } from '../context/GameContext'

export function HUD() {
  const { state } = useGame()
  const { player, zombies, difficulty, roomsCleared } = state
  
  const healthPercentage = (player.health / player.maxHealth) * 100
  const ammoPercentage = (player.ammo / player.maxAmmo) * 100
  const aliveZombies = zombies.filter(z => z.isActive).length

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
        {/* Health & Ammo */}
        <div className="bg-black/80 backdrop-blur-sm border border-red-900/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-red-500" />
            <div className="flex-1">
              <div className="flex justify-between text-sm text-white mb-1">
                <span>Health</span>
                <span>{player.health}/{player.maxHealth}</span>
              </div>
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-600 to-red-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${healthPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-yellow-500" />
            <div className="flex-1">
              <div className="flex justify-between text-sm text-white mb-1">
                <span>Ammo</span>
                <span>{player.ammo}/{player.maxAmmo}</span>
              </div>
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${ammoPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Score & Status */}
        <div className="bg-black/80 backdrop-blur-sm border border-red-900/50 rounded-lg p-4 text-right">
          <div className="text-white space-y-2">
            <div className="flex items-center gap-2 justify-end">
              <span className="text-sm">Score:</span>
              <span className="font-bold text-yellow-400">{player.score}</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Key className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Keys:</span>
              <span className="font-bold text-blue-400">{player.keys}</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <span className="text-sm">Difficulty:</span>
              <span className={`font-bold ${
                difficulty === 'easy' ? 'text-green-400' :
                difficulty === 'normal' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {difficulty.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <span className="text-sm">Rooms:</span>
              <span className="font-bold text-purple-400">{roomsCleared}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Center crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="relative w-8 h-8">
          <div className="absolute top-0 left-1/2 w-1 h-3 bg-red-500 transform -translate-x-1/2" />
          <div className="absolute bottom-0 left-1/2 w-1 h-3 bg-red-500 transform -translate-x-1/2" />
          <div className="absolute left-0 top-1/2 w-3 h-1 bg-red-500 transform -translate-y-1/2" />
          <div className="absolute right-0 top-1/2 w-3 h-1 bg-red-500 transform -translate-y-1/2" />
        </div>
      </div>
      {/* Low health warning */}
      {healthPercentage < 25 && (
        <motion.div
          className="absolute inset-0 bg-red-900/20 pointer-events-none"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      {/* Out of ammo warning */}
      {player.ammo === 0 && (
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <div className="bg-red-600/90 backdrop-blur-sm border border-red-400 rounded-lg p-4 text-center">
            <div className="text-white font-bold">OUT OF AMMO!</div>
            <div className="text-red-200 text-sm">Find more ammunition</div>
          </div>
        </motion.div>
      )}
      {/* Zombie Counter (bottom left) */}
      <div className="absolute bottom-4 left-4">
        <div className="bg-black/80 backdrop-blur-sm border border-red-900/50 rounded-lg p-3 flex items-center gap-2">
          <Skull className="w-5 h-5 text-red-500" />
          <span className="text-white text-sm">Zombies: <span className="font-bold text-red-400">{aliveZombies}</span></span>
        </div>
      </div>
    </div>
  )
}
