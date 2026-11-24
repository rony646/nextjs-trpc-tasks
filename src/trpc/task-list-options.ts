import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";

import type { AppRouter } from "@/server/root";
import { TASK_PAGE_SIZE } from "@/server/tasks/task.schema";

// Shared by the server prefetch and the client hook so both use the same query key.
// Kept apart from tasks.ts because the server page cannot import the client-only hooks.
export function taskListOptions(trpc: TRPCOptionsProxy<AppRouter>) {
  return trpc.task.list.infiniteQueryOptions(
    { limit: TASK_PAGE_SIZE },
    { getNextPageParam: (page) => page.nextCursor ?? undefined },
  );
}
