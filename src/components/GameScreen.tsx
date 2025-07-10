import { useEffect, useState, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { RoomFP } from './RoomFP';
import { ZombieFP } from './ZombieFP';
import { PlayerGun } from './PlayerGun';
import { useFPCamera } from '../hooks/useFPCamera';
import { useGameControls } from '../hooks/useGameControls';
import { spawnZombies, updateZombieAI } from '../utils/zombieUtils';
import { useToast } from '../hooks/use-toast';

interface GameScreenProps {
  onGameOver: () => void;
}

export function GameScreen({ onGameOver }: GameScreenProps) {
  const { state, updatePlayer, updateZombies, damagePlayer, dispatch, addScore } = useGame();
  const { zombies, difficulty } = state;
  const [shooting, setShooting] = useState(false);
  const { toast } = useToast();
  const { keys } = useGameControls();
  const { yaw, pointerLockRef, requestPointerLock } = useFPCamera();

  const gameLoopRef = useRef<number>();
  const lastUpdateTimeRef = useRef<number>(0);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Initial Zombie Spawn
  useEffect(() => {
    updateZombies(spawnZombies(5, difficulty));
  }, [difficulty, updateZombies]);

  const runGameLoop = useCallback(() => {
    const now = performance.now();
    lastUpdateTimeRef.current = now;

    const currentState = stateRef.current;

    // Player Movement
    const speed = 4;
    let newPlayerX = currentState.player.x;
    let newPlayerY = currentState.player.y;

    if (keys.w) {
      newPlayerX += Math.sin(yaw) * speed;
      newPlayerY -= Math.cos(yaw) * speed;
    }
    if (keys.s) {
      newPlayerX -= Math.sin(yaw) * speed;
      newPlayerY += Math.cos(yaw) * speed;
    }
    if (keys.a) {
      newPlayerX -= Math.cos(yaw) * speed;
      newPlayerY -= Math.sin(yaw) * speed;
    }
    if (keys.d) {
      newPlayerX += Math.cos(yaw) * speed;
      newPlayerY += Math.sin(yaw) * speed;
    }

    newPlayerX = Math.max(100, Math.min(700, newPlayerX));
    newPlayerY = Math.max(100, Math.min(500, newPlayerY));
    updatePlayer({ x: newPlayerX, y: newPlayerY });

    // Zombie AI and Attacks
    const updatedZombies = updateZombieAI(currentState.zombies, { x: newPlayerX, y: newPlayerY }, currentState.difficulty);
    updateZombies(updatedZombies);

    updatedZombies.forEach(zombie => {
      if (zombie.isActive) {
        const dx = newPlayerX - zombie.x;
        const dy = newPlayerY - zombie.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 40) { // Zombie attack range
          damagePlayer(0.1); // Small continuous damage
          if (currentState.player.health <= 0.1) {
            onGameOver();
          }
        }
      }
    });

    gameLoopRef.current = requestAnimationFrame(runGameLoop);
  }, [keys, yaw, updatePlayer, updateZombies, damagePlayer, onGameOver]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(runGameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [runGameLoop]);

  const handleShoot = useCallback(() => {
    if (stateRef.current.player.ammo <= 0) {
      toast({ title: "Out of ammo!", description: "Find more ammunition.", variant: "destructive" });
      return;
    }
    setShooting(true);
    setTimeout(() => setShooting(false), 120);
    dispatch({ type: 'USE_AMMO', payload: 1 });

    const hitZombie = stateRef.current.zombies.find(z => {
      const dx = z.x - 400, dy = z.y - 300;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angleToPlayer = Math.atan2(dx, -dy);
      const relAngle = angleToPlayer - yaw;
      return Math.abs(relAngle) < 0.18 && distance < 400 && z.isActive;
    });

    if (hitZombie) {
      const newZombies = stateRef.current.zombies.map(z =>
        z.id === hitZombie.id ? { ...z, health: Math.max(0, z.health - 50), isActive: z.health - 50 > 0 } : z
      );
      updateZombies(newZombies);
      addScore(50);
    }
  }, [dispatch, yaw, toast, updateZombies, addScore]);

  useEffect(() => {
    const handleMouseDown = () => {
      if (document.pointerLockElement === pointerLockRef.current) {
        handleShoot();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [handleShoot, pointerLockRef]);

  return (
    <div
      ref={pointerLockRef}
      className="relative w-full h-screen bg-black overflow-hidden cursor-crosshair"
      tabIndex={0}
      onClick={requestPointerLock}
    >
      <RoomFP yaw={yaw} />
      <AnimatePresence>
        {zombies.map(zombie => (
          zombie.isActive && <ZombieFP key={zombie.id} zombie={zombie} playerYaw={yaw} />
        ))}
      </AnimatePresence>
      <PlayerGun shooting={shooting} />
    </div>
  );
}