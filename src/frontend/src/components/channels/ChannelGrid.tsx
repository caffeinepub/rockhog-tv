import ChannelCard from './ChannelCard';
import type { Channel } from '../../backend';
import { Loader2 } from 'lucide-react';

interface ChannelGridProps {
  channels: Channel[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function ChannelGrid({ channels, isLoading, emptyMessage = 'No channels found' }: ChannelGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {channels.map((channel) => (
        <ChannelCard key={channel.id} channel={channel} />
      ))}
    </div>
  );
}

