import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react'

export interface Player {
  x: number
  y: number
  health: number
  maxHealth: number
  ammo: number
  maxAmmo: number
  keys: number
  score: number
  angle: number
}

export interface Zombie {
  id: string
  x: number
  y: number
  health: number
  maxHealth: number
  isActive: boolean
  speed: number
  lastAttack: number
}

export interface GameState {
  player: Player
  zombies: Zombie[]
  currentRoom: string
  gameTime: number
  isPlaying: boolean
  difficulty: 'easy' | 'normal' | 'hard'
  roomsCleared: number
}

type GameAction = 
  | { type: 'UPDATE_PLAYER'; payload: Partial<Player> }
  | { type: 'UPDATE_ZOMBIES'; payload: Zombie[] }
  | { type: 'DAMAGE_PLAYER'; payload: number }
  | { type: 'HEAL_PLAYER'; payload: number }
  | { type: 'USE_AMMO'; payload: number }
  | { type: 'ADD_AMMO'; payload: number }
  | { type: 'ADD_KEYS'; payload: number }
  | { type: 'ADD_SCORE'; payload: number }
  | { type: 'RESET_GAME' }
  | { type: 'SET_DIFFICULTY'; payload: 'easy' | 'normal' | 'hard' }
  | { type: 'CLEAR_ROOM' }

const initialState: GameState = {
  player: {
    x: 400,
    y: 300,
    health: 100,
    maxHealth: 100,
    ammo: 15,
    maxAmmo: 30,
    keys: 0,
    score: 0,
    angle: 0,
  },
  zombies: [],
  currentRoom: 'main_hall',
  gameTime: 0,
  isPlaying: false,
  difficulty: 'normal',
  roomsCleared: 0,
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'UPDATE_PLAYER':
      return {
        ...state,
        player: { ...state.player, ...action.payload }
      }
    
    case 'UPDATE_ZOMBIES':
      return {
        ...state,
        zombies: action.payload
      }
    
    case 'DAMAGE_PLAYER':
      return {
        ...state,
        player: {
          ...state.player,
          health: Math.max(0, state.player.health - action.payload)
        }
      }
    
    case 'HEAL_PLAYER':
      return {
        ...state,
        player: {
          ...state.player,
          health: Math.min(state.player.maxHealth, state.player.health + action.payload)
        }
      }
    
    case 'USE_AMMO':
      return {
        ...state,
        player: {
          ...state.player,
          ammo: Math.max(0, state.player.ammo - action.payload)
        }
      }
    
    case 'ADD_AMMO':
      return {
        ...state,
        player: {
          ...state.player,
          ammo: Math.min(state.player.maxAmmo, state.player.ammo + action.payload)
        }
      }
    
    case 'ADD_KEYS':
      return {
        ...state,
        player: {
          ...state.player,
          keys: state.player.keys + action.payload
        }
      }
    
    case 'ADD_SCORE':
      return {
        ...state,
        player: {
          ...state.player,
          score: state.player.score + action.payload
        }
      }
    
    case 'SET_DIFFICULTY':
      return {
        ...state,
        difficulty: action.payload
      }
    
    case 'CLEAR_ROOM':
      return {
        ...state,
        roomsCleared: state.roomsCleared + 1
      }
    
    case 'RESET_GAME':
      return initialState
    
    default:
      return state
  }
}

interface GameContextType {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  updatePlayer: (updates: Partial<Player>) => void
  updateZombies: (zombies: Zombie[]) => void
  damagePlayer: (damage: number) => void
  healPlayer: (healing: number) => void
  useAmmo: (amount: number) => void
  addAmmo: (amount: number) => void
  addKeys: (amount: number) => void
  addScore: (points: number) => void
  resetGame: () => void
  setDifficulty: (difficulty: 'easy' | 'normal' | 'hard') => void
  clearRoom: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const updatePlayer = useCallback((updates: Partial<Player>) => {
    dispatch({ type: 'UPDATE_PLAYER', payload: updates })
  }, [dispatch])

  const updateZombies = useCallback((zombies: Zombie[]) => {
    dispatch({ type: 'UPDATE_ZOMBIES', payload: zombies })
  }, [dispatch])

  const damagePlayer = useCallback((damage: number) => {
    dispatch({ type: 'DAMAGE_PLAYER', payload: damage })
  }, [dispatch])

  const healPlayer = useCallback((healing: number) => {
    dispatch({ type: 'HEAL_PLAYER', payload: healing })
  }, [dispatch])

  const useAmmo = useCallback((amount: number) => {
    dispatch({ type: 'USE_AMMO', payload: amount })
  }, [dispatch])

  const addAmmo = useCallback((amount: number) => {
    dispatch({ type: 'ADD_AMMO', payload: amount })
  }, [dispatch])

  const addKeys = useCallback((amount: number) => {
    dispatch({ type: 'ADD_KEYS', payload: amount })
  }, [dispatch])

  const addScore = useCallback((points: number) => {
    dispatch({ type: 'ADD_SCORE', payload: points })
  }, [dispatch])

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' })
  }, [dispatch])

  const setDifficulty = useCallback((difficulty: 'easy' | 'normal' | 'hard') => {
    dispatch({ type: 'SET_DIFFICULTY', payload: difficulty })
  }, [dispatch])

  const clearRoom = useCallback(() => {
    dispatch({ type: 'CLEAR_ROOM' })
  }, [dispatch])

  return (
    <GameContext.Provider value={{
      state,
      dispatch,
      updatePlayer,
      updateZombies,
      damagePlayer,
      healPlayer,
      useAmmo,
      addAmmo,
      addKeys,
      addScore,
      resetGame,
      setDifficulty,
      clearRoom,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}