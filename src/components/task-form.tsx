"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as Label from "@radix-ui/react-label";
import { Button, Flex, TextArea, TextField } from "@radix-ui/themes";
import { useId } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";

import { FieldErrorMessage } from "@/components/field-error-message";
import {
  createTaskInput,
  type CreateTaskInput,
} from "@/server/tasks/task.schema";

type TaskFormValues = z.input<typeof createTaskInput>;

type TaskFormProps = {
  defaultValues?: TaskFormValues;
  onSubmit: (values: CreateTaskInput) => void;
  isSubmitting: boolean;
};

const EMPTY_VALUES: TaskFormValues = { titulo: "", descricao: "" };
const DESCRICAO_ROWS = 4;
const LABEL_CLASS_NAME = "text-sm font-medium";

export function TaskForm({
  defaultValues = EMPTY_VALUES,
  onSubmit,
  isSubmitting,
}: TaskFormProps) {
  const tituloId = useId();
  const descricaoId = useId();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormValues, unknown, CreateTaskInput>({
    resolver: zodResolver(createTaskInput),
    defaultValues,
    mode: "onTouched",
  });
  const titulo = useWatch({ control, name: "titulo" });
  const isTituloEmpty = !titulo.trim();

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset disabled={isSubmitting} className="flex flex-col gap-4">
        <Flex direction="column" gap="1">
          <Label.Root htmlFor={tituloId} className={LABEL_CLASS_NAME}>
            Título
          </Label.Root>
          <TextField.Root
            id={tituloId}
            size="3"
            placeholder="Ex.: Revisar relatório mensal"
            color={errors.titulo ? "red" : undefined}
            aria-invalid={Boolean(errors.titulo)}
            aria-describedby={errors.titulo ? `${tituloId}-error` : undefined}
            {...register("titulo")}
          />
          <FieldErrorMessage id={`${tituloId}-error`} error={errors.titulo} />
        </Flex>

        <Flex direction="column" gap="1">
          <Label.Root htmlFor={descricaoId} className={LABEL_CLASS_NAME}>
            Descrição (opcional)
          </Label.Root>
          <TextArea
            id={descricaoId}
            size="3"
            rows={DESCRICAO_ROWS}
            resize="vertical"
            placeholder="Detalhes da tarefa"
            color={errors.descricao ? "red" : undefined}
            aria-invalid={Boolean(errors.descricao)}
            aria-describedby={
              errors.descricao ? `${descricaoId}-error` : undefined
            }
            {...register("descricao")}
          />
          <FieldErrorMessage
            id={`${descricaoId}-error`}
            error={errors.descricao}
          />
        </Flex>

        <Flex justify="end">
          <Button type="submit" size="3" disabled={isTituloEmpty}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </Flex>
      </fieldset>
    </form>
  );
}
