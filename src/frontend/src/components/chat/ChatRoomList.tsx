import { Loader2, MessageCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useGetChatRooms } from '../../hooks/useChatRooms';

interface ChatRoomListProps {
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
}

export default function ChatRoomList({ selectedRoomId, onSelectRoom }: ChatRoomListProps) {
  const { data: rooms, isLoading, error } = useGetChatRooms();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-chat-room-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Failed to load chat rooms
      </div>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No chat rooms available
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold mb-4 text-chat-room-text">Chat Rooms</h2>
        {rooms.map(([roomId, roomName]) => (
          <Button
            key={roomId}
            variant={selectedRoomId === roomId ? 'default' : 'ghost'}
            className={`w-full justify-start gap-2 ${
              selectedRoomId === roomId
                ? 'bg-chat-room-accent text-white hover:bg-chat-room-accent/90'
                : 'hover:bg-chat-room-message/50'
            }`}
            onClick={() => onSelectRoom(roomId)}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="truncate">{roomName}</span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
