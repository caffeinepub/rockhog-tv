import type { GameState, InputState } from './types';
import { Renderer } from './renderer';
import {
  updatePlayerMovement,
  updatePlayerAiming,
  tryFireProjectile,
  updateProjectiles,
  updateEnemies,
  checkCollisions,
  checkRoundEnd,
} from './systems';

export class GameLoop {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gameState: GameState;
  private renderer: Renderer;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private onStateChange: (state: GameState) => void;
  private inputProvider: (() => InputState) | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    gameState: GameState,
    onStateChange: (state: GameState) => void
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.gameState = gameState;
    this.renderer = new Renderer();
    this.onStateChange = onStateChange;
  }

  setInputProvider(provider: () => InputState): void {
    this.inputProvider = provider;
  }

  start(): void {
    this.lastTime = performance.now();
    this.gameState.status = 'playing';
    this.loop(this.lastTime);
  }

  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loop = (currentTime: number): void => {
    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    if (this.gameState.status === 'playing') {
      this.update(deltaTime, currentTime / 1000);
    }

    this.renderer.render(this.ctx, this.gameState);
    this.onStateChange(this.gameState);

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update(deltaTime: number, currentTime: number): void {
    if (!this.inputProvider) return;
    
    const input = this.inputProvider();

    updatePlayerMovement(
      this.gameState.player,
      input,
      deltaTime,
      this.gameState.canvasWidth,
      this.gameState.canvasHeight
    );

    updatePlayerAiming(this.gameState.player, input);

    if (input.firing) {
      tryFireProjectile(this.gameState.player, currentTime, this.gameState.projectiles);
    }

    updateProjectiles(this.gameState.projectiles, deltaTime);
    updateEnemies(
      this.gameState.enemies,
      deltaTime,
      this.gameState.canvasWidth,
      this.gameState.canvasHeight
    );

    checkCollisions(this.gameState.projectiles, this.gameState.enemies, this.gameState);
    checkRoundEnd(this.gameState);
  }
}
