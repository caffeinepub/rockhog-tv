import type { GameState } from './types';

export class Renderer {
  private baconBitImage: HTMLImageElement | null = null;
  private baconGunImage: HTMLImageElement | null = null;

  constructor() {
    this.baconBitImage = new Image();
    this.baconBitImage.src = '/assets/generated/bacon-bit.dim_256x256.png';
    
    this.baconGunImage = new Image();
    this.baconGunImage.src = '/assets/generated/bacon-gun-icon.dim_512x512.png';
  }

  render(ctx: CanvasRenderingContext2D, gameState: GameState): void {
    ctx.clearRect(0, 0, gameState.canvasWidth, gameState.canvasHeight);

    this.renderPlayer(ctx, gameState);
    this.renderEnemies(ctx, gameState);
    this.renderProjectiles(ctx, gameState);
  }

  private renderPlayer(ctx: CanvasRenderingContext2D, gameState: GameState): void {
    const player = gameState.player;
    
    ctx.save();
    ctx.translate(player.position.x, player.position.y);
    
    ctx.fillStyle = '#FF6B35';
    ctx.beginPath();
    ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#D84315';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.rotate(player.aimAngle);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, -4, player.radius + 15, 8);
    
    if (this.baconGunImage?.complete) {
      ctx.drawImage(this.baconGunImage, player.radius, -8, 16, 16);
    }

    ctx.restore();
  }

  private renderEnemies(ctx: CanvasRenderingContext2D, gameState: GameState): void {
    for (const enemy of gameState.enemies) {
      ctx.fillStyle = '#C62828';
      ctx.beginPath();
      ctx.arc(enemy.position.x, enemy.position.y, enemy.radius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#8B0000';
      ctx.lineWidth = 3;
      ctx.stroke();

      const healthBarWidth = enemy.radius * 2;
      const healthBarHeight = 4;
      const healthPercent = enemy.health / enemy.maxHealth;
      
      ctx.fillStyle = '#333';
      ctx.fillRect(
        enemy.position.x - healthBarWidth / 2,
        enemy.position.y - enemy.radius - 10,
        healthBarWidth,
        healthBarHeight
      );
      
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(
        enemy.position.x - healthBarWidth / 2,
        enemy.position.y - enemy.radius - 10,
        healthBarWidth * healthPercent,
        healthBarHeight
      );
    }
  }

  private renderProjectiles(ctx: CanvasRenderingContext2D, gameState: GameState): void {
    for (const proj of gameState.projectiles) {
      if (this.baconBitImage?.complete) {
        ctx.save();
        ctx.translate(proj.position.x, proj.position.y);
        const angle = Math.atan2(proj.velocity.y, proj.velocity.x);
        ctx.rotate(angle);
        ctx.drawImage(
          this.baconBitImage,
          -proj.radius * 2,
          -proj.radius * 2,
          proj.radius * 4,
          proj.radius * 4
        );
        ctx.restore();
      } else {
        ctx.fillStyle = '#FF6B35';
        ctx.beginPath();
        ctx.arc(proj.position.x, proj.position.y, proj.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
