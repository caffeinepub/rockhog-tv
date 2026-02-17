import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetMyBaconCashRequests, useRequestBaconCash, useGetBalance } from '../hooks/useQueries';
import AccessDeniedScreen from '../components/auth/AccessDeniedScreen';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Coins } from 'lucide-react';
import { toast } from 'sonner';

export default function BuyBaconCashPage() {
  const { identity } = useInternetIdentity();
  const { data: balance } = useGetBalance();
  const { data: requests = [], isLoading } = useGetMyBaconCashRequests();
  const requestBaconCash = useRequestBaconCash();
  const [amount, setAmount] = useState('');

  if (!identity) {
    return <AccessDeniedScreen message="Please log in to buy Bacon Cash." />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await requestBaconCash.mutateAsync(BigInt(amountNum));
      toast.success('Request submitted! An admin will process it soon.');
      setAmount('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit request');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Buy Bacon Cash</h1>
        <p className="text-muted-foreground">
          Current Balance: <span className="font-semibold text-primary">{balance !== undefined ? Number(balance).toLocaleString() : '0'}</span> Bacon Cash
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request Bacon Cash</CardTitle>
            <CardDescription>
              Submit a request to purchase Bacon Cash. An admin will process your request.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={requestBaconCash.isPending}>
                {requestBaconCash.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Requests</CardTitle>
            <CardDescription>
              Track the status of your Bacon Cash purchase requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : requests.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No requests yet
              </p>
            ) : (
              <div className="space-y-3">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <div className="font-medium">{Number(request.amount).toLocaleString()} Bacon Cash</div>
                      <div className="text-xs text-muted-foreground">Request ID: {request.id.slice(0, 12)}...</div>
                    </div>
                    <Badge variant={request.completed ? 'default' : 'secondary'}>
                      {request.completed ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

