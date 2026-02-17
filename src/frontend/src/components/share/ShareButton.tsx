import { Share2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ShareButton() {
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const handleShare = async () => {
    const url = window.location.href;
    const title = 'RockHog TV';
    const text = 'Check out RockHog TV - Stream your favorite content!';

    // Check if Web Share API is supported
    if (canShare) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        toast.success('Shared successfully!');
      } catch (error: any) {
        // User cancelled the share or an error occurred
        if (error.name !== 'AbortError') {
          console.error('Share error:', error);
          toast.error('Failed to share');
        }
      }
    } else {
      // Fallback to clipboard
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url);
          toast.success('Link copied to clipboard!');
        } else {
          // Fallback for browsers without clipboard API
          const textArea = document.createElement('textarea');
          textArea.value = url;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            document.execCommand('copy');
            toast.success('Link copied to clipboard!');
          } catch (err) {
            console.error('Fallback copy error:', err);
            toast.error('Failed to copy link');
          }
          document.body.removeChild(textArea);
        }
      } catch (error) {
        console.error('Clipboard error:', error);
        toast.error('Failed to copy link');
      }
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-foreground"
      title="Share RockHog TV"
    >
      {canShare ? (
        <Share2 className="w-5 h-5" />
      ) : (
        <Copy className="w-5 h-5" />
      )}
    </Button>
  );
}
