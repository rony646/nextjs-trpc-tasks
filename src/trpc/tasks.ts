import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";

import type { AppRouter } from "@/server/root";

import { useTRPC } from "./client";

export function useTaskList() {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.task.list.queryOptions({}));
}

export type TaskMutationError = TRPCClientErrorLike<AppRouter>;

export function isNotFoundError(error: TaskMutationError) {
  return error.data?.code === "NOT_FOUND";
}

function useInvalidateTaskList() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries(trpc.task.list.pathFilter());
}

export function useCreateTask() {
  const trpc = useTRPC();
  const invalidateTaskList = useInvalidateTaskList();
  return useMutation(
    trpc.task.create.mutationOptions({ onSuccess: invalidateTaskList }),
  );
}

// Update and delete refresh on error too: a NOT_FOUND means the task is already gone and should leave the list.
export function useUpdateTask() {
  const trpc = useTRPC();
  const invalidateTaskList = useInvalidateTaskList();
  return useMutation(
    trpc.task.update.mutationOptions({ onSettled: invalidateTaskList }),
  );
}

export function useDeleteTask() {
  const trpc = useTRPC();
  const invalidateTaskList = useInvalidateTaskList();
  return useMutation(
    trpc.task.delete.mutationOptions({ onSettled: invalidateTaskList }),
  );
}
