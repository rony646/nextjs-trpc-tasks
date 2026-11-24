import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it } from "vitest";
import { z, ZodError } from "zod";

import { createCaller } from "@/server/root";
import { createSeedTasks } from "@/server/tasks/seed";

import { TASK_NOT_FOUND_MESSAGE } from "./task";

const SEED_COUNT = createSeedTasks().length;
const PAGE_SIZE = 10;
const MISSING_ID = "00000000-0000-4000-8000-000000000000";

const caller = createCaller({});

async function catchTRPCError(promise: Promise<unknown>) {
  const error = await promise.catch((caught: unknown) => caught);
  expect(error).toBeInstanceOf(TRPCError);
  return error as TRPCError;
}

beforeEach(() => {
  Reflect.deleteProperty(globalThis, "taskStore");
});

describe("task.list", () => {
  it("pages through every task and ends with a null nextCursor", async () => {
    const ids: string[] = [];
    let cursor: string | undefined;
    do {
      const page = await caller.task.list({ cursor, limit: PAGE_SIZE });
      ids.push(...page.items.map((task) => task.id));
      cursor = page.nextCursor ?? undefined;
    } while (cursor);

    expect(new Set(ids).size).toBe(SEED_COUNT);
  });

  it("uses the default limit when none is given", async () => {
    const { items } = await caller.task.list({});

    expect(items).toHaveLength(PAGE_SIZE);
  });
});

describe("task.create", () => {
  it("returns the new task with a trimmed title", async () => {
    const task = await caller.task.create({ titulo: "  Nova tarefa  " });

    expect(task.titulo).toBe("Nova tarefa");
  });

  it("rejects a blank title with BAD_REQUEST and field errors", async () => {
    const error = await catchTRPCError(caller.task.create({ titulo: "   " }));

    expect(error.code).toBe("BAD_REQUEST");
    expect(error.cause).toBeInstanceOf(ZodError);
    expect(z.flattenError(error.cause as ZodError).fieldErrors).toEqual({
      titulo: ["O título é obrigatório"],
    });
  });
});

describe("task.update", () => {
  it("updates an existing task", async () => {
    const task = await caller.task.create({ titulo: "Antigo" });

    const updated = await caller.task.update({ id: task.id, titulo: "Novo" });

    expect(updated).toMatchObject({ id: task.id, titulo: "Novo" });
  });

  it("returns NOT_FOUND for a missing id", async () => {
    const error = await catchTRPCError(
      caller.task.update({ id: MISSING_ID, titulo: "Qualquer" }),
    );

    expect(error.code).toBe("NOT_FOUND");
    expect(error.message).toBe(TASK_NOT_FOUND_MESSAGE);
  });
});

describe("task.delete", () => {
  it("deletes an existing task", async () => {
    const task = await caller.task.create({ titulo: "Apagar" });

    await caller.task.delete({ id: task.id });

    const error = await catchTRPCError(caller.task.delete({ id: task.id }));
    expect(error.code).toBe("NOT_FOUND");
  });

  it("returns NOT_FOUND for a missing id", async () => {
    const error = await catchTRPCError(caller.task.delete({ id: MISSING_ID }));

    expect(error.code).toBe("NOT_FOUND");
    expect(error.message).toBe(TASK_NOT_FOUND_MESSAGE);
  });
});
