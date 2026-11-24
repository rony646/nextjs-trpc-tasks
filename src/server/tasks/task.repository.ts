import { createSeedTasks } from "./seed";
import type {
  CreateTaskInput,
  ListTasksInput,
  Task,
  UpdateTaskInput,
} from "./task.schema";

export type TaskPage = {
  items: Task[];
  nextCursor: string | null;
};

// Hot reload re-runs this module and Next.js may load it more than once, so the store lives on globalThis to keep one copy per process.
const globalForTasks = globalThis as typeof globalThis & {
  taskStore?: Map<string, Task>;
};

function getStore() {
  globalForTasks.taskStore ??= new Map(
    createSeedTasks().map((task) => [task.id, task]),
  );
  return globalForTasks.taskStore;
}

function newestFirst(a: Task, b: Task) {
  return (
    b.dataCriacao.getTime() - a.dataCriacao.getTime() ||
    b.id.localeCompare(a.id)
  );
}

// The only code that touches the store, so moving to a database would only change this file.
export const taskRepository = {
  // The cursor is the id of the last task already loaded: unlike an offset, it does not skip or repeat tasks when new ones are created.
  list({ cursor, limit }: ListTasksInput): TaskPage {
    const tasks = [...getStore().values()].sort(newestFirst);
    const cursorIndex = cursor
      ? tasks.findIndex((task) => task.id === cursor)
      : -1;
    if (cursor && cursorIndex === -1) {
      return { items: [], nextCursor: null };
    }

    const start = cursorIndex + 1;
    const items = tasks.slice(start, start + limit);
    const lastItem = items.at(-1);
    const hasMore = start + limit < tasks.length;
    return { items, nextCursor: hasMore && lastItem ? lastItem.id : null };
  },

  getById(id: string): Task | null {
    return getStore().get(id) ?? null;
  },

  create({ titulo, descricao }: CreateTaskInput): Task {
    const now = new Date();
    const task: Task = {
      id: crypto.randomUUID(),
      titulo,
      descricao,
      dataCriacao: now,
      dataAtualizacao: now,
    };
    getStore().set(task.id, task);
    return task;
  },

  update({ id, titulo, descricao }: UpdateTaskInput): Task | null {
    const existing = getStore().get(id);
    if (!existing) return null;

    const updated: Task = {
      ...existing,
      titulo,
      descricao,
      dataAtualizacao: new Date(),
    };
    getStore().set(id, updated);
    return updated;
  },

  delete(id: string): Task | null {
    const existing = getStore().get(id);
    if (!existing) return null;

    getStore().delete(id);
    return existing;
  },
};
