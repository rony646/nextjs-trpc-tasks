import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@/server/root";
import { TRPC_ENDPOINT } from "@/trpc/endpoint";

function handler(request: Request) {
  return fetchRequestHandler({
    endpoint: TRPC_ENDPOINT,
    req: request,
    router: appRouter,
    createContext: () => ({}),
  });
}

export { handler as GET, handler as POST };
