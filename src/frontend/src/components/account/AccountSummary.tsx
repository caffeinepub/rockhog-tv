import { useGetCallerUserProfile, useGetBalance } from '../../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Coins } from 'lucide-react';

export default function AccountSummary() {
  const navigate = useNavigate();
  const { data: profile } = useGetCallerUserProfile();
  const { data: balance } = useGetBalance();

  if (!profile) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="text-right hidden sm:block">
        <div className="text-sm font-medium">{profile.name}</div>
        <div className="text-xs text-muted-foreground">
          {balance !== undefined ? Number(balance).toLocaleString() : '0'} Bacon Cash
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate({ to: '/buy-bacon-cash' })}
        className="gap-2"
      >
        <Coins className="w-4 h-4" />
        <span className="hidden sm:inline">Buy</span>
      </Button>
    </div>
  );
}

