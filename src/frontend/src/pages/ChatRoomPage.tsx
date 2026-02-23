import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { usePostMessage } from '../hooks/useChatRooms';
import ChatRoomList from '../components/chat/ChatRoomList';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import LoginButton from '../components/auth/LoginButton';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ChatRoomPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const postMessageMutation = usePostMessage();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>('default-rockhog-lounge');

  const isAuthenticated = !!identity;

  const handleSendMessage = async (message: string) => {
    if (!selectedRoomId || !userProfile) return;

    try {
      await postMessageMutation.mutateAsync({
        roomId: selectedRoomId,
        senderName: userProfile.name,
        message,
      });
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="chat-room-page min-h-screen flex items-center justify-center p-4">
        <div className="chat-room-login-prompt">
          <h1 className="text-3xl font-bold text-chat-room-text mb-4">Join the Conversation</h1>
          <p className="text-chat-room-text/80 mb-6 text-center max-w-md">
            Log in to participate in live chat rooms and connect with the RockHog TV community.
          </p>
          <LoginButton />
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="chat-room-page min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-chat-room-accent" />
      </div>
    );
  }

  return (
    <div className="chat-room-page min-h-screen">
      <div className="chat-room-container">
        <div className="chat-room-sidebar">
          <ChatRoomList selectedRoomId={selectedRoomId} onSelectRoom={setSelectedRoomId} />
        </div>
        <div className="chat-room-main">
          {selectedRoomId ? (
            <>
              <div className="chat-room-messages">
                <MessageList roomId={selectedRoomId} />
              </div>
              <div className="chat-room-input-area">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  disabled={postMessageMutation.isPending}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a chat room to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
