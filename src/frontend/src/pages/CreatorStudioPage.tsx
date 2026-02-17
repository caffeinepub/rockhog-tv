import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetMyChannels } from '../hooks/useQueries';
import AccessDeniedScreen from '../components/auth/AccessDeniedScreen';
import ChannelEditorDialog from '../components/channels/ChannelEditorDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
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
import type { Channel } from '../backend';

export default function CreatorStudioPage() {
  const { identity } = useInternetIdentity();
  const { data: myChannels = [], isLoading } = useGetMyChannels();
  const [showEditor, setShowEditor] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | undefined>(undefined);
  const [deletingChannel, setDeletingChannel] = useState<Channel | null>(null);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myChannels.map((channel) => (
            <Card key={channel.id}>
              <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                <img
                  src={channel.thumbnail.getDirectURL()}
                  alt={channel.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1">{channel.title}</CardTitle>
                  <Badge variant="secondary">{channel.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {channel.description}
                </p>
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
            </Card>
          ))}
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

