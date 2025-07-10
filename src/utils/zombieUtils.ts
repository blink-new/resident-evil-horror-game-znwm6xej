import { Zombie } from '../context/GameContext'

export function spawnZombies(count: number, difficulty: 'easy' | 'normal' | 'hard'): Zombie[] {
  const zombies: Zombie[] = []
  
  for (let i = 0; i < count; i++) {
    const side = Math.floor(Math.random() * 4) // 0: top, 1: right, 2: bottom, 3: left
    let x, y
    
    switch (side) {
      case 0: // top
        x = Math.random() * 800
        y = 0
        break
      case 1: // right
        x = 800
        y = Math.random() * 600
        break
      case 2: // bottom
        x = Math.random() * 800
        y = 600
        break
      case 3: // left
        x = 0
        y = Math.random() * 600
        break
      default:
        x = Math.random() * 800
        y = Math.random() * 600
    }
    
    const baseHealth = difficulty === 'easy' ? 50 : difficulty === 'normal' ? 100 : 150
    const baseSpeed = difficulty === 'easy' ? 1 : difficulty === 'normal' ? 1.5 : 2
    
    zombies.push({
      id: `zombie_${Date.now()}_${i}`,
      x,
      y,
      health: baseHealth,
      maxHealth: baseHealth,
      isActive: true,
      speed: baseSpeed,
      lastAttack: 0,
    })
  }
  
  return zombies
}

export function updateZombieAI(
  zombies: Zombie[], 
  playerPosition: { x: number; y: number }, 
  difficulty: 'easy' | 'normal' | 'hard'
): Zombie[] {
  const now = Date.now()
  
  return zombies.map(zombie => {
    if (!zombie.isActive) return zombie
    
    // Calculate distance to player
    const dx = playerPosition.x - zombie.x
    const dy = playerPosition.y - zombie.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Move towards player
    if (distance > 25) {
      const moveX = (dx / distance) * zombie.speed
      const moveY = (dy / distance) * zombie.speed
      
      return {
        ...zombie,
        x: zombie.x + moveX,
        y: zombie.y + moveY,
      }
    }
    
    // Attack player if close enough and cooldown is over
    const attackCooldown = difficulty === 'easy' ? 2000 : difficulty === 'normal' ? 1500 : 1000
    if (distance <= 25 && now - zombie.lastAttack > attackCooldown) {
      return {
        ...zombie,
        lastAttack: now,
      }
    }
    
    return zombie
  })
}

export function damageZombie(zombie: Zombie, damage: number): Zombie {
  const newHealth = Math.max(0, zombie.health - damage)
  
  return {
    ...zombie,
    health: newHealth,
    isActive: newHealth > 0,
  }
}