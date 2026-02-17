import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Channel } from '../../backend';
import { Play } from 'lucide-react';

interface ChannelCardProps {
  channel: Channel;
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="group cursor-pointer overflow-hidden hover:ring-2 hover:ring-primary transition-all"
      onClick={() => navigate({ to: '/stream/$streamId', params: { streamId: channel.id } })}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={channel.thumbnail.getDirectURL()}
          alt={channel.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold line-clamp-2 flex-1">{channel.title}</h3>
          <Badge variant="secondary" className="shrink-0">
            {channel.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{channel.description}</p>
      </CardContent>
    </Card>
  );
}

