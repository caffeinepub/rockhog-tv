import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Channel, BaconCashRequest, UserProfile } from '../backend';
import { ExternalBlob } from '../backend';

export function useGetAllChannels() {
  const { actor, isFetching } = useActor();

  return useQuery<Channel[]>({
    queryKey: ['channels'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllChannels();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyChannels() {
  const { actor, isFetching } = useActor();

  return useQuery<Channel[]>({
    queryKey: ['myChannels'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyChannels();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetChannel(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Channel | null>({
    queryKey: ['channel', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getChannel(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateChannel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      title: string;
      category: string;
      description: string;
      thumbnail: ExternalBlob;
      streamUrl: string;
      ingestUrl: string;
      streamKey: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createChannel(
        data.id,
        data.title,
        data.category,
        data.description,
        data.thumbnail,
        data.streamUrl,
        data.ingestUrl,
        data.streamKey
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      queryClient.invalidateQueries({ queryKey: ['myChannels'] });
    },
  });
}

export function useUpdateChannel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      title: string;
      category: string;
      description: string;
      thumbnail: ExternalBlob;
      streamUrl: string;
      ingestUrl: string;
      streamKey: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateChannel(
        data.id,
        data.title,
        data.category,
        data.description,
        data.thumbnail,
        data.streamUrl,
        data.ingestUrl,
        data.streamKey
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      queryClient.invalidateQueries({ queryKey: ['myChannels'] });
      queryClient.invalidateQueries({ queryKey: ['channel', variables.id] });
    },
  });
}

export function useDeleteChannel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteChannel(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      queryClient.invalidateQueries({ queryKey: ['myChannels'] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetBalance() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['baconCashBalance'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getBalance();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRequestBaconCash() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestBaconCash(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBaconCashRequests'] });
    },
  });
}

export function useGetMyBaconCashRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<BaconCashRequest[]>({
    queryKey: ['myBaconCashRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyBaconCashRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllBaconCashRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<BaconCashRequest[]>({
    queryKey: ['allBaconCashRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBaconCashRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFulfillBaconCashRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.fulfillBaconCashRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBaconCashRequests'] });
      queryClient.invalidateQueries({ queryKey: ['baconCashBalance'] });
    },
  });
}
