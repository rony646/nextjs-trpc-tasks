import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createSeedTasks } from "./seed";
import { taskRepository, type TaskPage } from "./task.repository";
import type { Task } from "./task.schema";

const SEED_COUNT = createSeedTasks().length;
const PAGE_SIZE = 10;
const UNEVEN_PAGE_SIZE = 7;
const MISSING_ID = "00000000-0000-4000-8000-000000000000";
const ONE_MINUTE_MS = 60_000;

function listAllPages(limit: number) {
  const pages: TaskPage[] = [];
  let cursor: string | undefined;
  do {
    const page = taskRepository.list({ cursor, limit });
    pages.push(page);
    cursor = page.nextCursor ?? undefined;
  } while (cursor);
  return pages;
}

function isNewestFirst(tasks: Task[]) {
  return tasks.every(
    (task, index) =>
      index === 0 ||
      tasks[index - 1].dataCriacao.getTime() >= task.dataCriacao.getTime(),
  );
}

beforeEach(() => {
  Reflect.deleteProperty(globalThis, "taskStore");
});

afterEach(() => {
  vi.useRealTimers();
});

describe("taskRepository.list", () => {
  it.each([PAGE_SIZE, UNEVEN_PAGE_SIZE])(
    "returns every seed task exactly once, newest first, with limit %i",
    (limit) => {
      const pages = listAllPages(limit);
      const tasks = pages.flatMap((page) => page.items);

      expect(tasks).toHaveLength(SEED_COUNT);
      expect(new Set(tasks.map((task) => task.id)).size).toBe(SEED_COUNT);
      expect(isNewestFirst(tasks)).toBe(true);
      expect(pages.at(-1)?.nextCursor).toBeNull();
    },
  );

  it("shows a newly created task first", () => {
    taskRepository.list({ limit: PAGE_SIZE });
    vi.useFakeTimers();
    vi.advanceTimersByTime(ONE_MINUTE_MS);
    const created = taskRepository.create({ titulo: "Nova tarefa" });

    const { items } = taskRepository.list({ limit: PAGE_SIZE });

    expect(items[0]).toEqual(created);
  });

  it("returns an empty last page when the cursor task was deleted", () => {
    const { items } = taskRepository.list({ limit: PAGE_SIZE });
    const cursor = items[PAGE_SIZE - 1].id;
    taskRepository.delete(cursor);

    const page = taskRepository.list({ cursor, limit: PAGE_SIZE });

    expect(page).toEqual({ items: [], nextCursor: null });
  });
});

describe("taskRepository.create", () => {
  it("sets the id and both dates", () => {
    const task = taskRepository.create({
      titulo: "Escrever testes",
      descricao: "Cobrir o repositório",
    });

    expect(task.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(task.dataCriacao).toBeInstanceOf(Date);
    expect(task.dataAtualizacao).toEqual(task.dataCriacao);
    expect(taskRepository.getById(task.id)).toEqual(task);
  });
});

describe("taskRepository.update", () => {
  it("changes the fields and dataAtualizacao but keeps dataCriacao", () => {
    vi.useFakeTimers();
    const task = taskRepository.create({ titulo: "Título antigo" });
    vi.advanceTimersByTime(ONE_MINUTE_MS);

    const updated = taskRepository.update({
      id: task.id,
      titulo: "Título novo",
      descricao: "Agora com descrição",
    });

    expect(updated).toMatchObject({
      id: task.id,
      titulo: "Título novo",
      descricao: "Agora com descrição",
      dataCriacao: task.dataCriacao,
    });
    expect(updated?.dataAtualizacao.getTime()).toBeGreaterThan(
      task.dataCriacao.getTime(),
    );
  });

  it("returns null for a missing id", () => {
    expect(
      taskRepository.update({ id: MISSING_ID, titulo: "Qualquer" }),
    ).toBeNull();
  });
});

describe("taskRepository.delete", () => {
  it("removes the task and returns it", () => {
    const task = taskRepository.create({ titulo: "Apagar depois" });

    expect(taskRepository.delete(task.id)).toEqual(task);
    expect(taskRepository.getById(task.id)).toBeNull();
  });

  it("returns null for a missing id", () => {
    expect(taskRepository.delete(MISSING_ID)).toBeNull();
  });
});

describe("store", () => {
  it("keeps data when the module is loaded again, like on hot reload", async () => {
    const task = taskRepository.create({ titulo: "Sobrevive ao reload" });

    vi.resetModules();
    const { taskRepository: reloaded } = await import("./task.repository");

    expect(reloaded).not.toBe(taskRepository);
    expect(reloaded.getById(task.id)).toEqual(task);
  });

  it("starts from the seed data when the store is new, like after a restart", () => {
    taskRepository.create({ titulo: "Some no restart" });
    Reflect.deleteProperty(globalThis, "taskStore");

    expect(listAllPages(SEED_COUNT).flatMap((page) => page.items)).toHaveLength(
      SEED_COUNT,
    );
  });
});
