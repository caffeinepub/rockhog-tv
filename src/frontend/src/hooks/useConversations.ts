import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Conversation } from '../backend';

export function useGetConversations() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getConversations();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });
}

export function useGetConversation(conversationId: string) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<Conversation | null>({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getConversation(conversationId);
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!conversationId,
  });
}

export function useStoreConversation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { conversationId: string; conversation: Conversation }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.storeConversation(data.conversationId, data.conversation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
