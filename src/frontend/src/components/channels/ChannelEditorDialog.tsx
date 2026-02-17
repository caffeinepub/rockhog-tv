import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ThumbnailUploader from './ThumbnailUploader';
import { useCreateChannel, useUpdateChannel } from '../../hooks/useQueries';
import type { Channel } from '../../backend';
import { ExternalBlob } from '../../backend';
import { toast } from 'sonner';
import { getAllCategories, getCategoryLabel } from '../../utils/category';

interface ChannelEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channel?: Channel;
}

export default function ChannelEditorDialog({ open, onOpenChange, channel }: ChannelEditorDialogProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('music');
  const [description, setDescription] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [thumbnail, setThumbnail] = useState<ExternalBlob | null>(null);

  const createChannel = useCreateChannel();
  const updateChannel = useUpdateChannel();
  const categories = getAllCategories();

  useEffect(() => {
    if (channel) {
      setTitle(channel.title);
      setCategory(channel.category);
      setDescription(channel.description);
      setStreamUrl(channel.streamUrl);
      setThumbnail(channel.thumbnail);
    } else {
      setTitle('');
      setCategory('music');
      setDescription('');
      setStreamUrl('');
      setThumbnail(null);
    }
  }, [channel, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !streamUrl.trim() || !thumbnail) {
      toast.error('Please fill in all fields and upload a thumbnail');
      return;
    }

    try {
      const channelId = channel?.id || `channel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const data = {
        id: channelId,
        title: title.trim(),
        category,
        description: description.trim(),
        streamUrl: streamUrl.trim(),
        thumbnail,
        ingestUrl: channel?.ingestUrl || `rtmp://ingest.rockhog.tv/live/${channelId}`,
        streamKey: channel?.streamKey || `sk_${Math.random().toString(36).substr(2, 16)}`,
      };

      if (channel) {
        await updateChannel.mutateAsync(data);
        toast.success('Channel updated successfully!');
      } else {
        await createChannel.mutateAsync(data);
        toast.success('Channel created successfully!');
      }

      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save channel');
    }
  };

  const isLoading = createChannel.isPending || updateChannel.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{channel ? 'Edit Channel' : 'Create New Channel'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter channel title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your channel"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="streamUrl">Stream URL / Embed Code</Label>
            <Textarea
              id="streamUrl"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              placeholder="Enter stream URL or embed code (e.g., YouTube embed URL, Twitch embed, etc.)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <ThumbnailUploader thumbnail={thumbnail} onThumbnailChange={setThumbnail} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : channel ? 'Update Channel' : 'Create Channel'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
