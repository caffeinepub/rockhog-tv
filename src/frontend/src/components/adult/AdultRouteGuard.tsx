import { useState, useEffect } from 'react';
import { useAdultGate } from '../../hooks/useAdultGate';
import AdultGateDialog from './AdultGateDialog';
import { useNavigate } from '@tanstack/react-router';

interface AdultRouteGuardProps {
  children: React.ReactNode;
}

export default function AdultRouteGuard({ children }: AdultRouteGuardProps) {
  const { hasConsent, isLoading, grantConsent } = useAdultGate();
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !hasConsent) {
      setShowDialog(true);
    }
  }, [isLoading, hasConsent]);

  const handleConfirm = () => {
    grantConsent();
    setShowDialog(false);
  };

  const handleCancel = () => {
    setShowDialog(false);
    navigate({ to: '/' });
  };

  if (isLoading) {
    return null;
  }

  if (!hasConsent) {
    return <AdultGateDialog open={showDialog} onConfirm={handleConfirm} onCancel={handleCancel} />;
  }

  return <>{children}</>;
}

