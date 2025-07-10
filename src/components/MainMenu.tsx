import { motion } from 'framer-motion'
import { Skull, Play, Trophy } from 'lucide-react'
import { Button } from './ui/button'
import { useGame } from '../context/GameContext'

interface MainMenuProps {
  onStartGame: () => void
}

export function MainMenu({ onStartGame }: MainMenuProps) {
  const { setDifficulty, state } = useGame()

  const handleStartGame = (difficulty: 'easy' | 'normal' | 'hard') => {
    setDifficulty(difficulty)
    onStartGame()
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-black via-red-950/50 to-black flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Skull className="w-12 h-12 text-red-500" />
            <h1 className="text-6xl font-bold text-white tracking-wider">
              <span className="text-red-500">RESIDENT</span>
              <br />
              <span className="text-red-400">EVIL</span>
            </h1>
            <Skull className="w-12 h-12 text-red-500" />
          </div>
          <p className="text-lg text-gray-300 font-mono">Web Edition</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-6"
        >
          <div className="bg-black/50 backdrop-blur-sm border border-red-900/50 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Select Difficulty
            </h2>
            
            <div className="space-y-4">
              <Button
                onClick={() => handleStartGame('easy')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                size="lg"
              >
                <span className="flex items-center gap-2">
                  <span>🟢</span>
                  EASY - Rookie
                </span>
              </Button>
              
              <Button
                onClick={() => handleStartGame('normal')}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3"
                size="lg"
              >
                <span className="flex items-center gap-2">
                  <span>🟡</span>
                  NORMAL - Survivor
                </span>
              </Button>
              
              <Button
                onClick={() => handleStartGame('hard')}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
                size="lg"
              >
                <span className="flex items-center gap-2">
                  <span>🔴</span>
                  HARD - Nightmare
                </span>
              </Button>
            </div>
          </div>

          <div className="text-center text-gray-400 text-sm space-y-2">
            <p>🎮 Use WASD to move • 🖱️ Mouse to aim • 🔫 Click to shoot</p>
            <p>🔑 Collect keys • 💊 Find health items • 🧟 Survive the undead</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>High Score: {state.player.score}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Atmospheric particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px bg-gray-600 opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -window.innerHeight],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 8,
            }}
          />
        ))}
      </div>
    </div>
  )
}