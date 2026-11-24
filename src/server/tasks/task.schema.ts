import { z } from "zod";

export const TITULO_MAX_LENGTH = 100;
export const DESCRICAO_MAX_LENGTH = 500;
const LIST_DEFAULT_LIMIT = 10;
const LIST_MAX_LIMIT = 50;
const LIMIT_RANGE_MESSAGE = `O limite deve ser entre 1 e ${LIST_MAX_LIMIT}`;
const TITULO_REQUIRED_MESSAGE = "O título é obrigatório";

const idSchema = z.uuid("ID inválido");

const tituloSchema = z
  .string(TITULO_REQUIRED_MESSAGE)
  .trim()
  .min(1, TITULO_REQUIRED_MESSAGE)
  .max(
    TITULO_MAX_LENGTH,
    `O título deve ter no máximo ${TITULO_MAX_LENGTH} caracteres`,
  );

// An empty description from the form is stored as no description.
const descricaoSchema = z
  .string()
  .trim()
  .max(
    DESCRICAO_MAX_LENGTH,
    `A descrição deve ter no máximo ${DESCRICAO_MAX_LENGTH} caracteres`,
  )
  .transform((descricao) => descricao || undefined)
  .optional();

export const taskSchema = z.object({
  id: idSchema,
  titulo: z.string(),
  descricao: z.string().optional(),
  dataCriacao: z.date(),
  dataAtualizacao: z.date(),
});

export const createTaskInput = z.object({
  titulo: tituloSchema,
  descricao: descricaoSchema,
});

export const updateTaskInput = createTaskInput.extend({ id: idSchema });

export const deleteTaskInput = z.object({ id: idSchema });

export const listTasksInput = z.object({
  cursor: idSchema.optional(),
  limit: z
    .number()
    .int()
    .min(1, LIMIT_RANGE_MESSAGE)
    .max(LIST_MAX_LIMIT, LIMIT_RANGE_MESSAGE)
    .default(LIST_DEFAULT_LIMIT),
});

export type Task = z.infer<typeof taskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskInput>;
export type UpdateTaskInput = z.infer<typeof updateTaskInput>;
export type DeleteTaskInput = z.infer<typeof deleteTaskInput>;
export type ListTasksInput = z.infer<typeof listTasksInput>;
