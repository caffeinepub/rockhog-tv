import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetChatRoomMessages, usePostMessage } from '../../hooks/useChatRooms';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, LogIn } from 'lucide-react';
import { toast } from 'sonner';

interface StreamChatPanelProps {
  chatRoomId: string;
}

export default function StreamChatPanel({ chatRoomId }: StreamChatPanelProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const postMessage = usePostMessage();

  const handleSendMessage = async (message: string) => {
    if (!identity || !userProfile) {
      toast.error('Please log in to send messages');
      return;
    }

    try {
      await postMessage.mutateAsync({
        roomId: chatRoomId,
        senderName: userProfile.name,
        message,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  return (
    <Card className="h-[600px] flex flex-col bg-chat-room-bg border-chat-room-border">
      <CardHeader className="border-b border-chat-room-border pb-4">
        <CardTitle className="flex items-center gap-2 text-chat-room-accent">
          <MessageCircle className="w-5 h-5" />
          Live Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <MessageList roomId={chatRoomId} />
        </div>
        <div className="border-t border-chat-room-border p-4">
          {identity ? (
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={postMessage.isPending}
            />
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">Log in to join the chat</p>
              <Button
                onClick={login}
                disabled={loginStatus === 'logging-in'}
                className="gap-2"
              >
                <LogIn className="w-4 h-4" />
                {loginStatus === 'logging-in' ? 'Logging in...' : 'Log In'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
