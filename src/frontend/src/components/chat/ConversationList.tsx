import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageSquare, Loader2 } from 'lucide-react';
import type { Conversation } from '../../backend';

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
  isLoading: boolean;
}

export default function ConversationList({
  conversations,
  currentConversationId,
  onSelectConversation,
  isLoading,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <MessageSquare className="w-12 h-12 text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">No conversations yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Start chatting to create your first conversation
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-1">
        {conversations.map((conversation) => {
          const isActive = conversation.id === currentConversationId;
          const firstUserMessage = conversation.messages.find(m => !m.isAI);
          const preview = firstUserMessage?.text || 'New conversation';
          const truncatedPreview = preview.length > 60 ? preview.slice(0, 60) + '...' : preview;
          
          return (
            <Button
              key={conversation.id}
              variant={isActive ? 'secondary' : 'ghost'}
              className="w-full justify-start text-left h-auto py-3 px-3"
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="flex items-start gap-2 w-full">
                <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {truncatedPreview}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {conversation.messages.length} messages
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
