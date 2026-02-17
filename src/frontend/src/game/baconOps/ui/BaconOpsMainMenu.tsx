import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Target, Zap } from 'lucide-react';
import StatsPanel from './StatsPanel';

export type GameMode = 'arena' | 'practice';

interface BaconOpsMainMenuProps {
  onStart: (mode: GameMode) => void;
}

export default function BaconOpsMainMenu({ onStart }: BaconOpsMainMenuProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('arena');

  const modes = [
    {
      id: 'arena' as GameMode,
      name: 'Arena',
      icon: Target,
      description: 'Face waves of enemies. Survive to win. One life only.',
      difficulty: 'Standard',
    },
    {
      id: 'practice' as GameMode,
      name: 'Practice',
      icon: Zap,
      description: 'Train against fewer, stationary targets. No game over.',
      difficulty: 'Casual',
    },
  ];

  return (
    <div className="bacon-ops-menu">
      <div className="bacon-ops-menu-content">
        <img 
          src="/assets/generated/bacon-ops-logo.dim_1024x512.png" 
          alt="Bacon Ops Arena"
          className="bacon-ops-logo"
        />
        <p className="bacon-ops-tagline">
          Lock and load with crispy firepower
        </p>

        <div className="bacon-ops-mode-selection">
          <h3 className="bacon-ops-mode-title">Select Mode</h3>
          <div className="bacon-ops-mode-grid">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = selectedMode === mode.id;
              return (
                <Card
                  key={mode.id}
                  className={`bacon-ops-mode-card ${isSelected ? 'bacon-ops-mode-card-selected' : ''}`}
                  onClick={() => setSelectedMode(mode.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon className="w-5 h-5" />
                      {mode.name}
                    </CardTitle>
                    <CardDescription className="text-xs font-semibold uppercase tracking-wide">
                      {mode.difficulty}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{mode.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Button 
          size="lg" 
          onClick={() => onStart(selectedMode)}
          className="bacon-ops-start-btn"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Mission
        </Button>

        <StatsPanel />
      </div>
    </div>
  );
}
