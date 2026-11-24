import { QueryClient } from "@tanstack/react-query";

// Without a staleTime, the client refetches data the server just prefetched.
const STALE_TIME_MS = 30_000;

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: STALE_TIME_MS } },
  });
}
