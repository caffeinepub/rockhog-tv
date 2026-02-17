import { Button } from '@/components/ui/button';
import { RotateCcw, Home, Trophy, Skull } from 'lucide-react';

interface RoundOverlayProps {
  status: 'victory' | 'defeat';
  score: number;
  onRestart: () => void;
  onMenu: () => void;
}

export default function RoundOverlay({ status, score, onRestart, onMenu }: RoundOverlayProps) {
  return (
    <div className="bacon-ops-overlay">
      <div className="bacon-ops-overlay-content">
        <div className="bacon-ops-overlay-icon">
          {status === 'victory' ? (
            <Trophy className="w-20 h-20 text-yellow-500" />
          ) : (
            <Skull className="w-20 h-20 text-red-500" />
          )}
        </div>
        
        <h2 className="bacon-ops-overlay-title">
          {status === 'victory' ? 'Mission Complete!' : 'Mission Failed'}
        </h2>
        
        <div className="bacon-ops-overlay-score">
          <span className="text-muted-foreground">Final Score:</span>
          <span className="text-4xl font-bold text-primary">{score}</span>
        </div>

        <div className="bacon-ops-overlay-actions">
          <Button size="lg" onClick={onRestart} className="gap-2">
            <RotateCcw className="w-5 h-5" />
            Restart
          </Button>
          <Button size="lg" variant="outline" onClick={onMenu} className="gap-2">
            <Home className="w-5 h-5" />
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
