import type { Enemy, Vector2 } from './types';

export function updateDummyAI(enemy: Enemy): void {
  enemy.velocity.x = 0;
  enemy.velocity.y = 0;
}

export function updatePatrolAI(enemy: Enemy, canvasWidth: number, canvasHeight: number): void {
  if (enemy.patrolDirection === undefined) {
    enemy.patrolDirection = Math.random() * Math.PI * 2;
  }
}
