import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface StreamEmbedProps {
  streamUrl: string;
  title: string;
}

export default function StreamEmbed({ streamUrl, title }: StreamEmbedProps) {
  if (!streamUrl || !streamUrl.trim()) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Stream Not Available</AlertTitle>
        <AlertDescription>
          No stream source has been configured for this channel.
        </AlertDescription>
      </Alert>
    );
  }

  const isEmbedCode = streamUrl.includes('<iframe') || streamUrl.includes('<embed');
  
  if (isEmbedCode) {
    return (
      <div
        className="aspect-video w-full rounded-lg overflow-hidden bg-black"
        dangerouslySetInnerHTML={{ __html: streamUrl }}
      />
    );
  }

  const isYouTube = streamUrl.includes('youtube.com') || streamUrl.includes('youtu.be');
  const isTwitch = streamUrl.includes('twitch.tv');

  let embedUrl = streamUrl;

  if (isYouTube) {
    const videoId = streamUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  } else if (isTwitch) {
    const channelMatch = streamUrl.match(/twitch\.tv\/([^\/\?]+)/);
    if (channelMatch) {
      embedUrl = `https://player.twitch.tv/?channel=${channelMatch[1]}&parent=${window.location.hostname}`;
    }
  }

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

