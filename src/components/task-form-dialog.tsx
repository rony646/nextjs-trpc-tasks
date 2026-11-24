"use client";

import { Dialog } from "@radix-ui/themes";
import { useState, type ReactNode } from "react";

import { TaskForm, type SetFieldError } from "@/components/task-form";
import { useToast } from "@/components/toast/use-toast";
import type { CreateTaskInput, Task } from "@/server/tasks/task.schema";
import {
  isNotFoundError,
  useCreateTask,
  useUpdateTask,
  type TaskMutationError,
} from "@/trpc/tasks";

const TASK_FORM_FIELDS = ["titulo", "descricao"] as const;

const CREATE_TITLE = "Nova tarefa";
const EDIT_TITLE = "Editar tarefa";
const CREATED_MESSAGE = "Tarefa criada";
const UPDATED_MESSAGE = "Tarefa atualizada";
const SAVE_ERROR_MESSAGE = "Não foi possível salvar a tarefa";
const DIALOG_MAX_WIDTH = "480px";

function showServerFieldErrors(
  error: TaskMutationError,
  setFieldError: SetFieldError,
) {
  const fieldErrors: Partial<Record<string, string[]>> =
    error.data?.zodError?.fieldErrors ?? {};
  for (const field of TASK_FORM_FIELDS) {
    const [message] = fieldErrors[field] ?? [];
    if (message) setFieldError(field, message);
  }
}

type TaskFormDialogProps = {
  trigger: ReactNode;
  task?: Task;
};

export function TaskFormDialog({ trigger, task }: TaskFormDialogProps) {
  const [open, setOpen] = useState(false);
  const toast = useToast();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const isSubmitting = task ? updateTask.isPending : createTask.isPending;

  function handleOpenChange(nextOpen: boolean) {
    if (!isSubmitting) setOpen(nextOpen);
  }

  function handleSuccess() {
    setOpen(false);
    toast.success(task ? UPDATED_MESSAGE : CREATED_MESSAGE);
  }

  function handleError(error: TaskMutationError, setFieldError: SetFieldError) {
    if (isNotFoundError(error)) {
      setOpen(false);
      toast.error(error.message);
      return;
    }
    showServerFieldErrors(error, setFieldError);
    toast.error(SAVE_ERROR_MESSAGE);
  }

  function handleSubmit(values: CreateTaskInput, setFieldError: SetFieldError) {
    const callbacks = {
      onSuccess: handleSuccess,
      onError: (error: TaskMutationError) => handleError(error, setFieldError),
    };

    if (task) {
      updateTask.mutate({ id: task.id, ...values }, callbacks);
    } else {
      createTask.mutate(values, callbacks);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Content maxWidth={DIALOG_MAX_WIDTH} aria-describedby={undefined}>
        <Dialog.Title>{task ? EDIT_TITLE : CREATE_TITLE}</Dialog.Title>
        <TaskForm
          defaultValues={
            task && { titulo: task.titulo, descricao: task.descricao ?? "" }
          }
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
}
