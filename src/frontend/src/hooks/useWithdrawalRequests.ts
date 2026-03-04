import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RequestStatus, WithdrawalRequest } from "../backend";
import { useActor } from "./useActor";

export function useGetMyWithdrawalRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<WithdrawalRequest[]>({
    queryKey: ["myWithdrawalRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyWithdrawalRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllWithdrawalRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<WithdrawalRequest[]>({
    queryKey: ["allWithdrawalRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWithdrawalRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateWithdrawalRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      amount: bigint;
      creatorNotes: string | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createWithdrawalRequest(data.amount, data.creatorNotes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myWithdrawalRequests"] });
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useProcessWithdrawalRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      requestId: string;
      status: RequestStatus;
      adminNotes: string | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.processWithdrawalRequest(
        data.requestId,
        data.status,
        data.adminNotes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allWithdrawalRequests"] });
      queryClient.invalidateQueries({ queryKey: ["myWithdrawalRequests"] });
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}
