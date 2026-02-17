import type { GameState, Enemy, GameMode } from './types';
import {
  PLAYER_RADIUS,
  PLAYER_MAX_HEALTH,
  PLAYER_MAX_AMMO,
  PLAYER_FIRE_RATE,
  ENEMY_RADIUS,
  ENEMY_HEALTH,
  ROUND_ENEMY_COUNT,
} from './constants';

export function initializeGame(canvasWidth: number, canvasHeight: number, mode: GameMode = 'arena'): GameState {
  const enemies: Enemy[] = [];
  
  // Mode-specific enemy configuration
  const enemyCount = mode === 'practice' ? 3 : ROUND_ENEMY_COUNT;
  const enemyType = mode === 'practice' ? 'dummy' : 'patrol';
  
  for (let i = 0; i < enemyCount; i++) {
    const angle = (i / enemyCount) * Math.PI * 2;
    const distance = 250;
    const x = canvasWidth / 2 + Math.cos(angle) * distance;
    const y = canvasHeight / 2 + Math.sin(angle) * distance;
    
    enemies.push({
      position: { x, y },
      velocity: { x: 0, y: 0 },
      radius: ENEMY_RADIUS,
      health: ENEMY_HEALTH,
      maxHealth: ENEMY_HEALTH,
      type: enemyType,
      patrolDirection: enemyType === 'patrol' ? angle + Math.PI / 2 : undefined,
    });
  }

  return {
    status: 'menu',
    mode,
    player: {
      position: { x: canvasWidth / 2, y: canvasHeight / 2 },
      velocity: { x: 0, y: 0 },
      radius: PLAYER_RADIUS,
      health: PLAYER_MAX_HEALTH,
      maxHealth: PLAYER_MAX_HEALTH,
      ammo: PLAYER_MAX_AMMO,
      maxAmmo: PLAYER_MAX_AMMO,
      fireRate: PLAYER_FIRE_RATE,
      lastFireTime: 0,
      aimAngle: 0,
    },
    enemies,
    projectiles: [],
    score: 0,
    roundNumber: 1,
    canvasWidth,
    canvasHeight,
  };
}
