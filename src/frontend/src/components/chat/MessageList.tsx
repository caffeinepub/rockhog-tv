import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetChatRoomMessages } from '../../hooks/useChatRooms';

interface MessageListProps {
  roomId: string;
}

export default function MessageList({ roomId }: MessageListProps) {
  const { data: messages, isLoading, error } = useGetChatRoomMessages(roomId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);

  useEffect(() => {
    if (messages && messages.length > prevMessageCountRef.current) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      prevMessageCountRef.current = messages.length;
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-chat-room-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Failed to load messages
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No messages yet. Be the first to say hello!
      </div>
    );
  }

  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-4 py-4">
        {messages.map((message) => {
          const timestamp = new Date(Number(message.timestamp) / 1000000);
          const timeString = timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div key={`${message.id}-${message.timestamp}`} className="chat-room-bubble">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-semibold text-chat-room-accent text-sm">
                  {message.senderName}
                </span>
                <span className="text-xs text-muted-foreground">{timeString}</span>
              </div>
              <p className="text-chat-room-text break-words">{message.message}</p>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
}
