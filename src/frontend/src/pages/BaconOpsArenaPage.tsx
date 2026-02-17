import { useEffect, useRef, useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetBestScore, useUpdateBestScore } from '../hooks/useQueries';
import BaconOpsMainMenu from '../game/baconOps/ui/BaconOpsMainMenu';
import Hud from '../game/baconOps/ui/Hud';
import RoundOverlay from '../game/baconOps/ui/RoundOverlay';
import VirtualControls from '../game/baconOps/input/VirtualControls';
import { useDesktopControls } from '../game/baconOps/input/useDesktopControls';
import { useTouchControls } from '../game/baconOps/input/useTouchControls';
import { GameLoop } from '../game/baconOps/engine/gameLoop';
import { initializeGame } from '../game/baconOps/engine/gameState';
import type { GameState, GameMode } from '../game/baconOps/engine/types';

export default function BaconOpsArenaPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<GameLoop | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: bestScore } = useGetBestScore();
  const updateBestScore = useUpdateBestScore();

  const desktopInput = useDesktopControls(canvasRef, !isMobile && gameState?.status === 'playing');
  const touchInput = useTouchControls(isMobile && gameState?.status === 'playing');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const startGame = (mode: GameMode) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Stop any existing game loop before starting a new one
    if (gameLoopRef.current) {
      gameLoopRef.current.stop();
      gameLoopRef.current = null;
    }

    const newGameState = initializeGame(canvas.width, canvas.height, mode);
    setGameState(newGameState);

    const gameLoop = new GameLoop(canvas, ctx, newGameState, (updatedState) => {
      setGameState({ ...updatedState });
    });

    gameLoop.setInputProvider(() => isMobile ? touchInput : desktopInput);
    gameLoop.start();
    gameLoopRef.current = gameLoop;
  };

  const resetGame = () => {
    if (gameLoopRef.current) {
      gameLoopRef.current.stop();
      gameLoopRef.current = null;
    }
    setGameState(null);
  };

  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        gameLoopRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    // Only update best score for Arena mode and authenticated users
    if (
      gameState?.status === 'gameOver' && 
      gameState.mode === 'arena' &&
      identity && 
      gameState.score > 0
    ) {
      const currentBest = Number(bestScore || BigInt(0));
      if (gameState.score > currentBest) {
        updateBestScore.mutate(BigInt(gameState.score));
      }
    }
  }, [gameState?.status, gameState?.score, gameState?.mode, identity, bestScore, updateBestScore]);

  const handleRestart = () => {
    if (!gameState) return;
    const currentMode = gameState.mode;
    resetGame();
    setTimeout(() => startGame(currentMode), 100);
  };

  return (
    <div className="bacon-ops-page min-h-screen">
      <div className="bacon-ops-container">
        {!gameState && (
          <BaconOpsMainMenu onStart={startGame} />
        )}

        <div className={`bacon-ops-game-area ${!gameState ? 'hidden' : ''}`}>
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="bacon-ops-canvas"
          />
          
          {gameState && (
            <>
              <Hud 
                health={gameState.player.health}
                maxHealth={gameState.player.maxHealth}
                score={gameState.score}
                ammo={gameState.player.ammo}
                roundNumber={gameState.roundNumber}
              />
              
              {isMobile && gameState.status === 'playing' && (
                <VirtualControls />
              )}

              {gameState.status === 'gameOver' && (
                <RoundOverlay
                  status="defeat"
                  score={gameState.score}
                  onRestart={handleRestart}
                  onMenu={resetGame}
                />
              )}

              {gameState.status === 'roundComplete' && (
                <RoundOverlay
                  status="victory"
                  score={gameState.score}
                  onRestart={handleRestart}
                  onMenu={resetGame}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
