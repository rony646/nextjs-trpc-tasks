import { TRPCError } from "@trpc/server";

import { taskRepository } from "@/server/tasks/task.repository";
import {
  createTaskInput,
  deleteTaskInput,
  listTasksInput,
  updateTaskInput,
  type Task,
} from "@/server/tasks/task.schema";
import { publicProcedure, router } from "@/server/trpc";

export const TASK_NOT_FOUND_MESSAGE = "Tarefa não encontrada";

function assertFound(task: Task | null): Task {
  if (!task) {
    throw new TRPCError({ code: "NOT_FOUND", message: TASK_NOT_FOUND_MESSAGE });
  }
  return task;
}

export const taskRouter = router({
  list: publicProcedure
    .input(listTasksInput)
    .query(({ input }) => taskRepository.list(input)),

  create: publicProcedure
    .input(createTaskInput)
    .mutation(({ input }) => taskRepository.create(input)),

  update: publicProcedure
    .input(updateTaskInput)
    .mutation(({ input }) => assertFound(taskRepository.update(input))),

  delete: publicProcedure
    .input(deleteTaskInput)
    .mutation(({ input }) => assertFound(taskRepository.delete(input.id))),
});
