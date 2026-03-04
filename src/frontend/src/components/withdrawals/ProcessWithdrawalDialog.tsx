import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { WithdrawalRequest } from "../../backend";
import { RequestStatus } from "../../backend";
import { useProcessWithdrawalRequest } from "../../hooks/useWithdrawalRequests";

interface ProcessWithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: WithdrawalRequest | null;
  action: "approve" | "reject";
}

export default function ProcessWithdrawalDialog({
  open,
  onOpenChange,
  request,
  action,
}: ProcessWithdrawalDialogProps) {
  const processRequest = useProcessWithdrawalRequest();
  const [adminNotes, setAdminNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!request) return;

    const status =
      action === "approve" ? RequestStatus.approved : RequestStatus.rejected;

    try {
      await processRequest.mutateAsync({
        requestId: request.id,
        status,
        adminNotes: adminNotes.trim() || null,
      });
      toast.success(
        `Withdrawal request ${action === "approve" ? "approved" : "rejected"} successfully`,
      );
      setAdminNotes("");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} withdrawal request`);
    }
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {action === "approve" ? "Approve" : "Reject"} Withdrawal Request
          </DialogTitle>
          <DialogDescription>
            {action === "approve"
              ? "Confirm approval and the amount will be deducted from the creator's balance."
              : "Confirm rejection. No balance changes will occur."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Request Details</Label>
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className="text-sm font-semibold">
                    {Number(request.amount).toLocaleString()} Bacon Cash
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Requested:
                  </span>
                  <span className="text-sm">
                    {new Date(
                      Number(request.timestamp) / 1000000,
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {request.creatorNotes && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Creator Notes</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">{request.creatorNotes}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
              <Textarea
                id="adminNotes"
                placeholder="Add notes about this decision..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={processRequest.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={action === "approve" ? "default" : "destructive"}
              disabled={processRequest.isPending}
            >
              {processRequest.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
