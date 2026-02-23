import { User, Sparkles } from 'lucide-react';

interface MessageBubbleProps {
  message: string;
  isAI: boolean;
}

export default function MessageBubble({ message, isAI }: MessageBubbleProps) {
  return (
    <div className={`flex items-start gap-3 ${isAI ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isAI
            ? 'bg-gradient-to-br from-primary to-accent'
            : 'bg-secondary'
        }`}
      >
        {isAI ? (
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        ) : (
          <User className="w-4 h-4 text-secondary-foreground" />
        )}
      </div>
      
      {/* Message Content */}
      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
          isAI
            ? 'bg-muted/50 text-foreground rounded-tl-sm'
            : 'bg-primary text-primary-foreground rounded-tr-sm'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message}
        </p>
      </div>
    </div>
  );
}
