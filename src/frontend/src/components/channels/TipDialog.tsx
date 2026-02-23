import { useState } from 'react';
import { useGetCallerUserProfile, useSendTip } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Coins } from 'lucide-react';
import { toast } from 'sonner';
import type { Principal } from '@icp-sdk/core/principal';

interface TipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelId: string;
  channelTitle: string;
  channelOwner: Principal;
}

export default function TipDialog({
  open,
  onOpenChange,
  channelId,
  channelTitle,
  channelOwner,
}: TipDialogProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const sendTip = useSendTip();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const balance = userProfile ? Number(userProfile.baconCashBalance) : 0;
  const tipAmount = parseInt(amount) || 0;
  const isValidAmount = tipAmount > 0 && tipAmount <= balance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidAmount) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await sendTip.mutateAsync({
        channelId,
        recipient: channelOwner,
        amount: BigInt(tipAmount),
        message: message.trim() || null,
      });

      toast.success('Tip sent successfully!');
      setAmount('');
      setMessage('');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send tip');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary" />
            Tip Streamer
          </DialogTitle>
          <DialogDescription>
            Send Bacon Cash to support {channelTitle}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Your Balance</p>
            <p className="text-2xl font-bold">{balance} Bacon Cash</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Tip Amount</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              max={balance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
            {tipAmount > balance && (
              <p className="text-sm text-destructive">Insufficient balance</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message to your tip..."
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/200
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={sendTip.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValidAmount || sendTip.isPending}
              className="gap-2"
            >
              {sendTip.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4" />
                  Send Tip
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
