import { Heart, Crosshair, Target } from 'lucide-react';

interface HudProps {
  health: number;
  maxHealth: number;
  score: number;
  ammo: number;
  roundNumber: number;
}

export default function Hud({ health, maxHealth, score, ammo, roundNumber }: HudProps) {
  const healthPercent = (health / maxHealth) * 100;

  return (
    <div className="bacon-ops-hud">
      <div className="bacon-ops-hud-top">
        <div className="bacon-ops-hud-item">
          <Heart className="w-5 h-5" />
          <div className="bacon-ops-health-bar">
            <div 
              className="bacon-ops-health-fill"
              style={{ width: `${healthPercent}%` }}
            />
          </div>
          <span className="bacon-ops-hud-value">{health}</span>
        </div>

        <div className="bacon-ops-hud-item">
          <Target className="w-5 h-5" />
          <span className="bacon-ops-hud-label">Score:</span>
          <span className="bacon-ops-hud-value">{score}</span>
        </div>
      </div>

      <div className="bacon-ops-hud-bottom">
        <div className="bacon-ops-hud-item">
          <Crosshair className="w-5 h-5" />
          <span className="bacon-ops-hud-label">Round {roundNumber}</span>
        </div>
      </div>
    </div>
  );
}
