import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface AdultGateDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AdultGateDialog({ open, onConfirm, onCancel }: AdultGateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Adult Content Warning
          </DialogTitle>
          <DialogDescription>
            You are about to access adult content.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive">
          <AlertDescription>
            This section contains mature content intended for adults only. By continuing, you confirm that you are 18 years of age or older and agree to view adult content.
          </AlertDescription>
        </Alert>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="w-full sm:w-auto">
            I am 18+ and Agree
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

