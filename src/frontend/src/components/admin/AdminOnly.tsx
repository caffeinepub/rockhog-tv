import { useIsAdmin } from '../../hooks/useAuthz';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import AccessDeniedScreen from '../auth/AccessDeniedScreen';
import { Loader2 } from 'lucide-react';

interface AdminOnlyProps {
  children: React.ReactNode;
}

export default function AdminOnly({ children }: AdminOnlyProps) {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsAdmin();

  if (!identity) {
    return <AccessDeniedScreen message="Please log in to access this page." />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen message="This page is only accessible to administrators." />;
  }

  return <>{children}</>;
}

