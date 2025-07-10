import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { Player } from './Player'
import { Zombie } from './Zombie'
import { Room } from './Room'
import { useGameControls } from '../hooks/useGameControls'
import { spawnZombies, updateZombieAI } from '../utils/zombieUtils'
import { checkCollisions } from '../utils/gameUtils'
import { useToast } from '../hooks/use-toast'

interface GameScreenProps {
  onGameOver: () => void
}

export function GameScreen({ onGameOver }: GameScreenProps) {
  const { state, updatePlayer, updateZombies, damagePlayer, dispatch, addScore } = useGame()
  const { player, zombies, difficulty } = state
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const [bullets, setBullets] = useState<Array<{ id: string; x: number; y: number; angle: number; speed: number }>>([])
  const [effects, setEffects] = useState<Array<{ id: string; type: 'blood' | 'muzzle'; x: number; y: number }>>([])
  const { toast } = useToast()
  
  const { keys, mousePosition } = useGameControls()

  // Initialize zombies when game starts
  useEffect(() => {
    if (zombies.length === 0) {
      const initialZombies = spawnZombies(3, difficulty)
      updateZombies(initialZombies)
    }
  }, [difficulty, zombies.length, updateZombies])

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

    dispatch({ type: 'USE_AMMO', payload: 1 })
    
    const bullet = {
      id: Date.now().toString(),
      x: player.x,
      y: player.y,
      angle: player.angle,
      speed: 12
    }
    
    setBullets(prev => [...prev, bullet])
    setEffects(prev => [...prev, { id: Date.now().toString(), type: 'muzzle', x: player.x, y: player.y }])
  }

  // Handle mouse click for shooting
  useEffect(() => {
    const handleMouseClick = (e: MouseEvent) => {
      if (e.target === gameAreaRef.current || gameAreaRef.current?.contains(e.target as Node)) {
        handleShoot()
      }
    }

    document.addEventListener('click', handleMouseClick)
    return () => document.removeEventListener('click', handleMouseClick)
  }, [player.ammo, player.x, player.y, player.angle])

  // Game loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      // Update player position based on keys
      const speed = 3
      let newX = player.x
      let newY = player.y

      if (keys.w) newY -= speed
      if (keys.s) newY += speed
      if (keys.a) newX -= speed
      if (keys.d) newX += speed

      // Keep player in bounds
      newX = Math.max(50, Math.min(750, newX))
      newY = Math.max(50, Math.min(550, newY))

      // Calculate player angle towards mouse
      if (gameAreaRef.current && mousePosition) {
        const rect = gameAreaRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const angle = Math.atan2(mousePosition.y - centerY, mousePosition.x - centerX)
        updatePlayer({ x: newX, y: newY, angle })
      }

      // Update bullets
      setBullets(prevBullets => {
        return prevBullets
          .map(bullet => ({
            ...bullet,
            x: bullet.x + Math.cos(bullet.angle) * bullet.speed,
            y: bullet.y + Math.sin(bullet.angle) * bullet.speed
          }))
          .filter(bullet => 
            bullet.x > 0 && bullet.x < 800 && 
            bullet.y > 0 && bullet.y < 600
          )
      })

      // Update zombies
      const updatedZombies = updateZombieAI(zombies, { x: newX, y: newY }, difficulty)
      updateZombies(updatedZombies)

      // Check collisions
      const collisionResults = checkCollisions(bullets, updatedZombies, { x: newX, y: newY })
      
      if (collisionResults.bulletHits.length > 0) {
        setBullets(prevBullets => 
          prevBullets.filter(bullet => 
            !collisionResults.bulletHits.some(hit => hit.bulletId === bullet.id)
          )
        )
        
        collisionResults.bulletHits.forEach(hit => {
          addScore(50)
          setEffects(prev => [...prev, { id: Date.now().toString(), type: 'blood', x: hit.x, y: hit.y }])
        })
      }

      if (collisionResults.zombieAttacks.length > 0) {
        const totalDamage = collisionResults.zombieAttacks.reduce((sum, attack) => sum + attack.damage, 0)
        damagePlayer(totalDamage)
        
        if (player.health - totalDamage <= 0) {
          onGameOver()
        }
      }

      // Spawn new zombies periodically
      if (Math.random() < 0.02 * (difficulty === 'easy' ? 0.5 : difficulty === 'hard' ? 2 : 1)) {
        const newZombies = spawnZombies(1, difficulty)
        updateZombies([...updatedZombies, ...newZombies])
      }
    }, 16) // ~60 FPS

    return () => clearInterval(gameLoop)
  }, [keys, mousePosition, player, zombies, difficulty, updatePlayer, updateZombies, damagePlayer, addScore, onGameOver, bullets])

  // Clear effects after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setEffects(prev => prev.slice(-5)) // Keep only last 5 effects
    }, 100)
    return () => clearTimeout(timer)
  }, [effects])

  return (
    <div 
      ref={gameAreaRef}
      className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden cursor-crosshair"
    >
      {/* Room/Background */}
      <Room />
      
      {/* Player */}
      <Player x={player.x} y={player.y} angle={player.angle} health={player.health} />
      
      {/* Zombies */}
      <AnimatePresence>
        {zombies.map(zombie => (
          zombie.isActive && (
            <Zombie
              key={zombie.id}
              x={zombie.x}
              y={zombie.y}
              health={zombie.health}
              maxHealth={zombie.maxHealth}
              isActive={zombie.isActive}
            />
          )
        ))}
      </AnimatePresence>
      
      {/* Bullets */}
      <AnimatePresence>
        {bullets.map(bullet => (
          <motion.div
            key={bullet.id}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full shadow-lg"
            style={{
              left: bullet.x,
              top: bullet.y,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          />
        ))}
      </AnimatePresence>
      
      {/* Effects */}
      <AnimatePresence>
        {effects.map(effect => (
          <motion.div
            key={effect.id}
            className={`absolute ${
              effect.type === 'blood' ? 'w-4 h-4 bg-red-600' : 'w-2 h-2 bg-yellow-400'
            } rounded-full`}
            style={{
              left: effect.x,
              top: effect.y,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </AnimatePresence>
      
      {/* Environmental elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Atmospheric particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px bg-gray-600 opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </div>
  )
}