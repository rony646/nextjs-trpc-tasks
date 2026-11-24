import { taskRouter } from "./routers/task";
import { createCallerFactory, publicProcedure, router } from "./trpc";

const HEALTHY_STATUS = "ok";

export const appRouter = router({
  health: publicProcedure.query(() => ({
    status: HEALTHY_STATUS,
    serverTime: new Date(),
  })),
  task: taskRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
