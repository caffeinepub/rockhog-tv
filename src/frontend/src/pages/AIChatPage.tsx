import { useState, useEffect, useRef } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetConversations, useStoreConversation } from '../hooks/useConversations';
import MessageBubble from '../components/chat/MessageBubble';
import ChatInput from '../components/chat/ChatInput';
import ConversationList from '../components/chat/ConversationList';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, MessageSquarePlus, Menu, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { AIMessage, Conversation } from '../backend';

export default function AIChatPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const { data: conversations = [], isLoading: conversationsLoading } = useGetConversations();
  const { mutateAsync: storeConversation, isPending: isSaving } = useStoreConversation();
  
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load conversation when selected
  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setMessages(conversation.messages);
  };

  // Start new conversation
  const handleNewConversation = () => {
    setCurrentConversation(null);
    setMessages([]);
  };

  // Simple AI response generator (rule-based, no external APIs)
  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Greeting responses
    if (lowerMessage.match(/\b(hi|hello|hey|greetings)\b/)) {
      return "Hello! I'm your AI assistant. I can help you with information about RockHog TV, answer questions, or just chat. What would you like to know?";
    }
    
    // RockHog TV specific
    if (lowerMessage.includes('rockhog') || lowerMessage.includes('streaming')) {
      return "RockHog TV is a decentralized streaming platform built on the Internet Computer. You can browse channels across categories like Music, Gaming, Sports, Horror, and more. Creators can set up their own channels in the Creator Studio!";
    }
    
    // Bacon Cash
    if (lowerMessage.includes('bacon cash') || lowerMessage.includes('currency')) {
      return "Bacon Cash is the virtual currency used on RockHog TV. You can request Bacon Cash top-ups from the Buy Bacon Cash page, and admins will fulfill your requests. It's used for various features across the platform!";
    }
    
    // Categories
    if (lowerMessage.includes('categories') || lowerMessage.includes('content')) {
      return "RockHog TV offers 10 content categories: Music, Gaming, Sports, Horror, Adult, Radio, DJs, IRL, Audio & Video Podcasts, and PPV Events. Each category has its own dedicated page with curated channels!";
    }
    
    // Creator info
    if (lowerMessage.includes('creator') || lowerMessage.includes('stream') || lowerMessage.includes('channel')) {
      return "Want to become a creator? Head to the Creator Studio! You can create your own channels, manage stream settings, and get your unique ingest URL and stream key for broadcasting. It's easy to get started!";
    }
    
    // Help/capabilities
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do') || lowerMessage.includes('capabilities')) {
      return "I can help you with:\n• Information about RockHog TV features\n• Guidance on creating channels\n• Explaining Bacon Cash\n• Navigating the platform\n• General questions and conversation\n\nJust ask me anything!";
    }
    
    // Thanks
    if (lowerMessage.match(/\b(thanks|thank you|thx)\b/)) {
      return "You're welcome! Feel free to ask if you need anything else. I'm here to help!";
    }
    
    // Goodbye
    if (lowerMessage.match(/\b(bye|goodbye|see you|later)\b/)) {
      return "Goodbye! Come back anytime you need assistance. Happy streaming!";
    }
    
    // Default responses based on question words
    if (lowerMessage.includes('how')) {
      return "That's a great question! For detailed how-to guides, I recommend exploring the platform features. If you're looking to create content, check out the Creator Studio. For watching content, browse our category pages!";
    }
    
    if (lowerMessage.includes('what')) {
      return "RockHog TV is a comprehensive streaming platform with diverse content categories, creator tools, and a virtual economy. What specific aspect would you like to know more about?";
    }
    
    if (lowerMessage.includes('why')) {
      return "RockHog TV was built to provide a decentralized, creator-friendly streaming experience on the Internet Computer blockchain. This ensures transparency, security, and true ownership for creators!";
    }
    
    if (lowerMessage.includes('when')) {
      return "RockHog TV is live and ready for you to explore! You can start browsing channels, creating content, or chatting with me anytime.";
    }
    
    if (lowerMessage.includes('where')) {
      return "You can find everything you need right here on RockHog TV! Use the navigation menu to explore categories, visit the Creator Studio, or manage your Bacon Cash.";
    }
    
    // Generic fallback responses
    const fallbacks = [
      "That's interesting! Tell me more about what you're looking for on RockHog TV.",
      "I'm here to help! Could you provide more details about your question?",
      "Great question! While I'm a simple AI, I can help with RockHog TV features, navigation, and general information. What would you like to know?",
      "I appreciate your message! I'm best at answering questions about RockHog TV's features and helping you navigate the platform. How can I assist you?",
      "Thanks for chatting with me! I'm designed to help with RockHog TV-related questions. What aspect of the platform interests you most?",
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  // Handle message submission
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: AIMessage = {
      isAI: false,
      text: text.trim(),
    };
    
    // Add user message immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsProcessing(true);
    
    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Generate AI response
    const aiResponseText = generateAIResponse(text);
    const aiMessage: AIMessage = {
      isAI: true,
      text: aiResponseText,
    };
    
    const finalMessages = [...updatedMessages, aiMessage];
    setMessages(finalMessages);
    setIsProcessing(false);
    
    // Save conversation for authenticated users
    if (isAuthenticated && identity) {
      try {
        const conversationId = currentConversation?.id || `conv_${Date.now()}_${identity.getPrincipal().toString().slice(0, 8)}`;
        const conversationToSave: Conversation = {
          id: conversationId,
          owner: identity.getPrincipal(),
          messages: finalMessages,
        };
        
        await storeConversation({
          conversationId,
          conversation: conversationToSave,
        });
        
        // Update current conversation reference
        if (!currentConversation) {
          setCurrentConversation(conversationToSave);
        }
      } catch (error) {
        console.error('Failed to save conversation:', error);
      }
    }
  };

  const conversationListContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border/50">
        <Button
          onClick={handleNewConversation}
          className="w-full gap-2"
          variant="outline"
        >
          <MessageSquarePlus className="w-4 h-4" />
          New Conversation
        </Button>
      </div>
      <ConversationList
        conversations={conversations}
        currentConversationId={currentConversation?.id}
        onSelectConversation={handleSelectConversation}
        isLoading={conversationsLoading}
      />
    </div>
  );

  return (
    <div className="ai-chat-page min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-6 h-[calc(100vh-4rem)]">
        <div className="flex gap-4 h-full">
          {/* Desktop Sidebar */}
          {isAuthenticated && (
            <aside className="hidden lg:block w-80 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 overflow-hidden">
              {conversationListContent}
            </aside>
          )}
          
          {/* Main Chat Area */}
          <main className="flex-1 flex flex-col bg-card/30 backdrop-blur-sm rounded-lg border border-border/50 overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50">
              <div className="flex items-center gap-3">
                {isAuthenticated && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="lg:hidden">
                        <Menu className="w-5 h-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      {conversationListContent}
                    </SheetContent>
                  </Sheet>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold">AI Assistant</h1>
                    <p className="text-xs text-muted-foreground">Always here to help</p>
                  </div>
                </div>
              </div>
              {!isAuthenticated && (
                <div className="text-sm text-muted-foreground">
                  Login to save conversations
                </div>
              )}
            </header>
            
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                      <Sparkles className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Welcome to AI Chat</h2>
                    <p className="text-muted-foreground max-w-md mb-6">
                      I'm your AI assistant for RockHog TV. Ask me anything about the platform, 
                      streaming, creating content, or just chat!
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                      <Button
                        variant="outline"
                        className="justify-start text-left h-auto py-3 px-4"
                        onClick={() => handleSendMessage("What is RockHog TV?")}
                      >
                        <div>
                          <div className="font-medium">What is RockHog TV?</div>
                          <div className="text-xs text-muted-foreground">Learn about the platform</div>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start text-left h-auto py-3 px-4"
                        onClick={() => handleSendMessage("How do I create a channel?")}
                      >
                        <div>
                          <div className="font-medium">How do I create a channel?</div>
                          <div className="text-xs text-muted-foreground">Get started as a creator</div>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start text-left h-auto py-3 px-4"
                        onClick={() => handleSendMessage("What is Bacon Cash?")}
                      >
                        <div>
                          <div className="font-medium">What is Bacon Cash?</div>
                          <div className="text-xs text-muted-foreground">Learn about our currency</div>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start text-left h-auto py-3 px-4"
                        onClick={() => handleSendMessage("What categories are available?")}
                      >
                        <div>
                          <div className="font-medium">What categories are available?</div>
                          <div className="text-xs text-muted-foreground">Explore content types</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                )}
                
                {messages.map((message, index) => (
                  <MessageBubble
                    key={index}
                    message={message.text}
                    isAI={message.isAI}
                  />
                ))}
                
                {isProcessing && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 rounded-2xl px-4 py-3">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Input Area */}
            <div className="p-4 border-t border-border/50 bg-card/50">
              <ChatInput
                onSendMessage={handleSendMessage}
                disabled={isProcessing || isSaving}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
