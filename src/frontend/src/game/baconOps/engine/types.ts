export interface Vector2 {
  x: number;
  y: number;
}

export interface Entity {
  position: Vector2;
  velocity: Vector2;
  radius: number;
}

export interface Player extends Entity {
  health: number;
  maxHealth: number;
  ammo: number;
  maxAmmo: number;
  fireRate: number;
  lastFireTime: number;
  aimAngle: number;
}

export interface Enemy extends Entity {
  health: number;
  maxHealth: number;
  type: 'dummy' | 'patrol';
  patrolDirection?: number;
}

export interface Projectile extends Entity {
  damage: number;
  lifetime: number;
  maxLifetime: number;
}

export interface InputState {
  moveX: number;
  moveY: number;
  aimX: number;
  aimY: number;
  firing: boolean;
}

export type GameStatus = 'menu' | 'playing' | 'paused' | 'roundComplete' | 'gameOver';

export type GameMode = 'arena' | 'practice';

export interface GameState {
  status: GameStatus;
  mode: GameMode;
  player: Player;
  enemies: Enemy[];
  projectiles: Projectile[];
  score: number;
  roundNumber: number;
  canvasWidth: number;
  canvasHeight: number;
}
