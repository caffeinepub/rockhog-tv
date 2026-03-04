import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetCallerUserProfile } from "../../hooks/useQueries";
import { useCreateWithdrawalRequest } from "../../hooks/useWithdrawalRequests";

interface WithdrawalRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WithdrawalRequestDialog({
  open,
  onOpenChange,
}: WithdrawalRequestDialogProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const createRequest = useCreateWithdrawalRequest();
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const balance = userProfile ? Number(userProfile.baconCashBalance) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = Number.parseFloat(amount);

    if (Number.isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount greater than zero");
      return;
    }

    if (amountNum > balance) {
      toast.error("Withdrawal amount exceeds your current balance");
      return;
    }

    try {
      await createRequest.mutateAsync({
        amount: BigInt(Math.floor(amountNum)),
        creatorNotes: notes.trim() || null,
      });
      toast.success("Withdrawal request submitted successfully");
      setAmount("");
      setNotes("");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit withdrawal request");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Withdrawal</DialogTitle>
          <DialogDescription>
            Submit a request to withdraw your Bacon Cash earnings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Current Balance</Label>
                <span className="text-2xl font-bold text-primary">
                  {balance.toLocaleString()} 🥓
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount (Bacon Cash)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                max={balance}
                step="1"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Maximum: {balance.toLocaleString()} Bacon Cash
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Payment Instructions (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add your payment details or account information..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Include your preferred payment method and account details
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createRequest.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createRequest.isPending}>
              {createRequest.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
