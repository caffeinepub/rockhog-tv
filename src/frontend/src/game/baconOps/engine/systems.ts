import type { GameState, Player, Enemy, Projectile, InputState, Vector2 } from './types';
import {
  PLAYER_SPEED,
  PROJECTILE_SPEED,
  PROJECTILE_DAMAGE,
  PROJECTILE_LIFETIME,
  PROJECTILE_RADIUS,
  ENEMY_PATROL_SPEED,
  POINTS_PER_KILL,
  ROUND_ENEMY_COUNT,
  ENEMY_RADIUS,
  ENEMY_HEALTH,
} from './constants';

export function updatePlayerMovement(player: Player, input: InputState, deltaTime: number, canvasWidth: number, canvasHeight: number): void {
  const moveLength = Math.sqrt(input.moveX * input.moveX + input.moveY * input.moveY);
  if (moveLength > 0) {
    const normalizedX = input.moveX / moveLength;
    const normalizedY = input.moveY / moveLength;
    
    player.velocity.x = normalizedX * PLAYER_SPEED;
    player.velocity.y = normalizedY * PLAYER_SPEED;
  } else {
    player.velocity.x = 0;
    player.velocity.y = 0;
  }

  player.position.x += player.velocity.x * deltaTime;
  player.position.y += player.velocity.y * deltaTime;

  player.position.x = Math.max(player.radius, Math.min(canvasWidth - player.radius, player.position.x));
  player.position.y = Math.max(player.radius, Math.min(canvasHeight - player.radius, player.position.y));
}

export function updatePlayerAiming(player: Player, input: InputState): void {
  const dx = input.aimX - player.position.x;
  const dy = input.aimY - player.position.y;
  player.aimAngle = Math.atan2(dy, dx);
}

export function tryFireProjectile(player: Player, currentTime: number, projectiles: Projectile[]): void {
  if (currentTime - player.lastFireTime < player.fireRate) {
    return;
  }

  player.lastFireTime = currentTime;

  const projectile: Projectile = {
    position: { x: player.position.x, y: player.position.y },
    velocity: {
      x: Math.cos(player.aimAngle) * PROJECTILE_SPEED,
      y: Math.sin(player.aimAngle) * PROJECTILE_SPEED,
    },
    radius: PROJECTILE_RADIUS,
    damage: PROJECTILE_DAMAGE,
    lifetime: 0,
    maxLifetime: PROJECTILE_LIFETIME,
  };

  projectiles.push(projectile);
}

export function updateProjectiles(projectiles: Projectile[], deltaTime: number): void {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const proj = projectiles[i];
    proj.position.x += proj.velocity.x * deltaTime;
    proj.position.y += proj.velocity.y * deltaTime;
    proj.lifetime += deltaTime;

    if (proj.lifetime >= proj.maxLifetime) {
      projectiles.splice(i, 1);
    }
  }
}

export function updateEnemies(enemies: Enemy[], deltaTime: number, canvasWidth: number, canvasHeight: number): void {
  for (const enemy of enemies) {
    if (enemy.type === 'patrol' && enemy.patrolDirection !== undefined) {
      const angle = enemy.patrolDirection;
      enemy.velocity.x = Math.cos(angle) * ENEMY_PATROL_SPEED;
      enemy.velocity.y = Math.sin(angle) * ENEMY_PATROL_SPEED;

      enemy.position.x += enemy.velocity.x * deltaTime;
      enemy.position.y += enemy.velocity.y * deltaTime;

      if (enemy.position.x <= enemy.radius || enemy.position.x >= canvasWidth - enemy.radius) {
        enemy.patrolDirection = Math.PI - angle;
      }
      if (enemy.position.y <= enemy.radius || enemy.position.y >= canvasHeight - enemy.radius) {
        enemy.patrolDirection = -angle;
      }
    }
  }
}

export function checkCollisions(projectiles: Projectile[], enemies: Enemy[], gameState: GameState): void {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const proj = projectiles[i];
    
    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];
      const dx = proj.position.x - enemy.position.x;
      const dy = proj.position.y - enemy.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < proj.radius + enemy.radius) {
        enemy.health -= proj.damage;
        projectiles.splice(i, 1);

        if (enemy.health <= 0) {
          enemies.splice(j, 1);
          gameState.score += POINTS_PER_KILL;
        }
        break;
      }
    }
  }
}

export function checkRoundEnd(gameState: GameState): void {
  // Arena mode: standard round completion and game over
  if (gameState.mode === 'arena') {
    if (gameState.enemies.length === 0 && gameState.status === 'playing') {
      gameState.status = 'roundComplete';
    }

    if (gameState.player.health <= 0 && gameState.status === 'playing') {
      gameState.status = 'gameOver';
    }
  }
  
  // Practice mode: respawn enemies when all are defeated, no game over
  if (gameState.mode === 'practice') {
    if (gameState.enemies.length === 0 && gameState.status === 'playing') {
      // Respawn practice enemies
      const enemyCount = 3;
      for (let i = 0; i < enemyCount; i++) {
        const angle = (i / enemyCount) * Math.PI * 2;
        const distance = 250;
        const x = gameState.canvasWidth / 2 + Math.cos(angle) * distance;
        const y = gameState.canvasHeight / 2 + Math.sin(angle) * distance;
        
        gameState.enemies.push({
          position: { x, y },
          velocity: { x: 0, y: 0 },
          radius: ENEMY_RADIUS,
          health: ENEMY_HEALTH,
          maxHealth: ENEMY_HEALTH,
          type: 'dummy',
          patrolDirection: undefined,
        });
      }
    }
    // In practice mode, player doesn't die
  }
}

function distance(a: Vector2, b: Vector2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}
