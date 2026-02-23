import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ChatMessage } from '../backend';

export function useGetChatRooms() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, string]>>({
    queryKey: ['chatRooms'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllChatRooms();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetChatRoomMessages(roomId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ['chatRoomMessages', roomId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatRoomMessages(roomId);
    },
    enabled: !!actor && !isFetching && !!roomId,
    refetchInterval: 2500, // Poll every 2.5 seconds for real-time updates
  });
}

export function usePostMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { roomId: string; senderName: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.postMessage(data.roomId, data.senderName, data.message);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chatRoomMessages', variables.roomId] });
    },
  });
}
