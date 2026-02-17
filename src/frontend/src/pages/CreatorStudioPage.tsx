import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetMyChannels } from '../hooks/useQueries';
import AccessDeniedScreen from '../components/auth/AccessDeniedScreen';
import ChannelEditorDialog from '../components/channels/ChannelEditorDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Loader2, Copy, Check } from 'lucide-react';
import { useDeleteChannel } from '../hooks/useQueries';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import type { Channel } from '../backend';

export default function CreatorStudioPage() {
  const { identity } = useInternetIdentity();
  const { data: myChannels = [], isLoading } = useGetMyChannels();
  const [showEditor, setShowEditor] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | undefined>(undefined);
  const [deletingChannel, setDeletingChannel] = useState<Channel | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const deleteChannel = useDeleteChannel();

  if (!identity) {
    return <AccessDeniedScreen message="Please log in to access the Creator Studio." />;
  }

  const handleCreateNew = () => {
    setEditingChannel(undefined);
    setShowEditor(true);
  };

  const handleEdit = (channel: Channel) => {
    setEditingChannel(channel);
    setShowEditor(true);
  };

  const handleDelete = async () => {
    if (!deletingChannel) return;

    try {
      await deleteChannel.mutateAsync(deletingChannel.id);
      toast.success('Channel deleted successfully');
      setDeletingChannel(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete channel');
    }
  };

  const handleCopy = async (text: string, fieldName: string, channelId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      const fieldKey = `${channelId}-${fieldName}`;
      setCopiedField(fieldKey);
      toast.success(`${fieldName} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        const fieldKey = `${channelId}-${fieldName}`;
        setCopiedField(fieldKey);
        toast.success(`${fieldName} copied to clipboard`);
        setTimeout(() => setCopiedField(null), 2000);
      } catch (err) {
        toast.error('Failed to copy to clipboard');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Creator Studio</h1>
          <p className="text-muted-foreground">Manage your channels and streams</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Create Channel
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : myChannels.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground mb-4">You haven't created any channels yet.</p>
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Channel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {myChannels.map((channel) => {
            const ingestUrlKey = `${channel.id}-Ingest URL`;
            const streamKeyKey = `${channel.id}-Stream Key`;
            const isIngestUrlCopied = copiedField === ingestUrlKey;
            const isStreamKeyCopied = copiedField === streamKeyKey;

            return (
              <Card key={channel.id}>
                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
                  <div className="aspect-video md:aspect-auto overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none bg-muted">
                    <img
                      src={channel.thumbnail.getDirectURL()}
                      alt={channel.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="line-clamp-1">{channel.title}</CardTitle>
                        <Badge variant="secondary">{channel.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {channel.description}
                      </p>

                      <Separator />

                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold">Live Streaming Connection Info</h3>
                        
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">Ingest URL</label>
                          <div className="flex gap-2">
                            <div className="flex-1 px-3 py-2 bg-muted rounded-md text-sm font-mono break-all">
                              {channel.ingestUrl}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopy(channel.ingestUrl, 'Ingest URL', channel.id)}
                              className="shrink-0"
                            >
                              {isIngestUrlCopied ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">Stream Key</label>
                          <div className="flex gap-2">
                            <div className="flex-1 px-3 py-2 bg-muted rounded-md text-sm font-mono break-all">
                              {channel.streamKey}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopy(channel.streamKey, 'Stream Key', channel.id)}
                              className="shrink-0"
                            >
                              {isStreamKeyCopied ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(channel)}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeletingChannel(channel)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ChannelEditorDialog
        open={showEditor}
        onOpenChange={setShowEditor}
        channel={editingChannel}
      />

      <AlertDialog open={!!deletingChannel} onOpenChange={(open) => !open && setDeletingChannel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Channel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingChannel?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
