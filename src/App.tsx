import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameScreen } from './components/GameScreen'
import { MainMenu } from './components/MainMenu'
import { HUD } from './components/HUD'
import { GameProvider } from './context/GameContext'
import { useToast } from './hooks/use-toast'

export type GameState = 'menu' | 'playing' | 'paused' | 'gameOver'

function App() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const { toast } = useToast()

  useEffect(() => {
    // Preload audio and set up dark theme
    document.body.classList.add('dark')
    
    // Show welcome message
    if (gameState === 'menu') {
      toast({
        title: "Welcome to Resident Evil: Web Edition",
        description: "Survive the zombie apocalypse. Use WASD to move, mouse to aim, click to shoot.",
        duration: 5000,
      })
    }
  }, [gameState, toast])

  return (
    <GameProvider>
      <div className="relative w-full h-screen bg-black overflow-hidden">
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MainMenu onStartGame={() => setGameState('playing')} />
            </motion.div>
          )}
          
          {gameState === 'playing' && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full"
            >
              <GameScreen onGameOver={() => setGameState('gameOver')} />
              <HUD />
            </motion.div>
          )}
          
          {gameState === 'gameOver' && (
            <motion.div
              key="gameOver"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center w-full h-full bg-red-900/50"
            >
              <div className="text-center">
                <h1 className="text-4xl font-bold text-red-500 mb-4">GAME OVER</h1>
                <p className="text-white mb-8">You were consumed by the darkness...</p>
                <button 
                  onClick={() => setGameState('menu')}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Return to Menu
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameProvider>
  )
}

export default App