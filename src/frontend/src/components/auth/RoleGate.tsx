import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsAdmin } from '../../hooks/useAuthz';
import type { Channel } from '../../backend';

interface RoleGateProps {
  children: React.ReactNode;
  channel?: Channel;
  requireAdmin?: boolean;
}

export default function RoleGate({ children, channel, requireAdmin = false }: RoleGateProps) {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return null;
  }

  if (!identity) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  if (channel && !isAdmin) {
    const isOwner = channel.owner.toString() === identity.getPrincipal().toString();
    if (!isOwner) {
      return null;
    }
  }

  return <>{children}</>;
}

