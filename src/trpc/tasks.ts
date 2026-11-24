import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { useTRPC } from "./client";

export function useTaskList() {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.task.list.queryOptions({}));
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

export function useUpdateTask() {
  const trpc = useTRPC();
  const invalidateTaskList = useInvalidateTaskList();
  return useMutation(
    trpc.task.update.mutationOptions({ onSuccess: invalidateTaskList }),
  );
}

export function useDeleteTask() {
  const trpc = useTRPC();
  const invalidateTaskList = useInvalidateTaskList();
  // Refresh on error too: a NOT_FOUND means the task is already gone and should leave the list.
  return useMutation(
    trpc.task.delete.mutationOptions({ onSettled: invalidateTaskList }),
  );
}
