import { Zombie } from '../context/GameContext'

interface Bullet {
  id: string
  x: number
  y: number
  angle: number
  speed: number
}

interface BulletHit {
  bulletId: string
  zombieId: string
  x: number
  y: number
  damage: number
}

interface ZombieAttack {
  zombieId: string
  damage: number
}

interface CollisionResults {
  bulletHits: BulletHit[]
  zombieAttacks: ZombieAttack[]
  updatedZombies: Zombie[]
}

export function checkCollisions(
  bullets: Bullet[],
  zombies: Zombie[],
  playerPosition: { x: number; y: number }
): CollisionResults {
  const bulletHits: BulletHit[] = []
  const zombieAttacks: ZombieAttack[] = []
  const updatedZombies: Zombie[] = []

  // Check bullet-zombie collisions
  bullets.forEach(bullet => {
    zombies.forEach(zombie => {
      if (!zombie.isActive) return

      const dx = bullet.x - zombie.x
      const dy = bullet.y - zombie.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 15) { // Collision detected
        const damage = 50
        const newHealth = Math.max(0, zombie.health - damage)
        
        bulletHits.push({
          bulletId: bullet.id,
          zombieId: zombie.id,
          x: zombie.x,
          y: zombie.y,
          damage,
        })

        updatedZombies.push({
          ...zombie,
          health: newHealth,
          isActive: newHealth > 0,
        })
      } else {
        updatedZombies.push(zombie)
      }
    })
  })

  // Check zombie-player collisions
  zombies.forEach(zombie => {
    if (!zombie.isActive) return

    const dx = playerPosition.x - zombie.x
    const dy = playerPosition.y - zombie.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < 25) { // Zombie is attacking
      const now = Date.now()
      if (now - zombie.lastAttack > 1000) { // Attack cooldown
        zombieAttacks.push({
          zombieId: zombie.id,
          damage: 20,
        })
      }
    }
  })

  return {
    bulletHits,
    zombieAttacks,
    updatedZombies: updatedZombies.length > 0 ? updatedZombies : zombies,
  }
}

export function getRandomPosition(width: number, height: number, margin: number = 50) {
  return {
    x: Math.random() * (width - 2 * margin) + margin,
    y: Math.random() * (height - 2 * margin) + margin,
  }
}

export function calculateDistance(pos1: { x: number; y: number }, pos2: { x: number; y: number }) {
  const dx = pos1.x - pos2.x
  const dy = pos1.y - pos2.y
  return Math.sqrt(dx * dx + dy * dy)
}

export function calculateAngle(from: { x: number; y: number }, to: { x: number; y: number }) {
  return Math.atan2(to.y - from.y, to.x - from.x)
}