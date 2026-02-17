import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import { useGetBestScore } from '../../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StatsPanel() {
  const { identity, login } = useInternetIdentity();
  const { data: bestScore, isLoading } = useGetBestScore();

  if (!identity) {
    return (
      <Card className="bacon-ops-stats-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Guest Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Log in to save your best score and compete on the leaderboard!
          </p>
          <Button onClick={login} className="w-full gap-2">
            <LogIn className="w-4 h-4" />
            Log In to Save Progress
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bacon-ops-stats-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Your Best Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-2xl font-bold text-muted-foreground">Loading...</div>
        ) : (
          <div className="text-4xl font-bold text-primary">
            {Number(bestScore || BigInt(0))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
