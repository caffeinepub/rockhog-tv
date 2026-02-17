import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetChannel } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsAdmin } from '../hooks/useAuthz';
import StreamEmbed from '../components/player/StreamEmbed';
import AdultRouteGuard from '../components/adult/AdultRouteGuard';
import RoleGate from '../components/auth/RoleGate';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ChannelEditorDialog from '../components/channels/ChannelEditorDialog';
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

function StreamDetailContent() {
  const { streamId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const { data: channel, isLoading } = useGetChannel(streamId || '');
  const [showEditor, setShowEditor] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteChannel = useDeleteChannel();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Channel Not Found</h1>
        <p className="text-muted-foreground mb-6">The channel you're looking for doesn't exist.</p>
        <Button onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  const isOwner = identity && channel.owner.toString() === identity.getPrincipal().toString();
  const canEdit = isOwner || isAdmin;

  const handleDelete = async () => {
    try {
      await deleteChannel.mutateAsync(channel.id);
      toast.success('Channel deleted successfully');
      navigate({ to: '/' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete channel');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: '/' })}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="max-w-6xl mx-auto space-y-6">
        <StreamEmbed streamUrl={channel.streamUrl} title={channel.title} />

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{channel.title}</h1>
              <Badge>{channel.category}</Badge>
            </div>
            <p className="text-muted-foreground">{channel.description}</p>
          </div>

          {canEdit && (
            <div className="flex gap-2">
              <RoleGate channel={channel}>
                <Button variant="outline" size="sm" onClick={() => setShowEditor(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </RoleGate>
              <RoleGate channel={channel}>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </RoleGate>
            </div>
          )}
        </div>
      </div>

      {showEditor && (
        <ChannelEditorDialog
          open={showEditor}
          onOpenChange={setShowEditor}
          channel={channel}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Channel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{channel.title}"? This action cannot be undone.
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

export default function StreamDetailPage() {
  const { streamId } = useParams({ strict: false });
  const { data: channel } = useGetChannel(streamId || '');

  if (channel?.category.toLowerCase() === 'adult') {
    return (
      <AdultRouteGuard>
        <StreamDetailContent />
      </AdultRouteGuard>
    );
  }

  return <StreamDetailContent />;
}

