"use client";

import { Dialog } from "@radix-ui/themes";
import { useState, type ReactNode } from "react";

import { TaskForm } from "@/components/task-form";
import { useToast } from "@/components/toast/use-toast";
import type { CreateTaskInput, Task } from "@/server/tasks/task.schema";
import { useCreateTask, useUpdateTask } from "@/trpc/tasks";

const CREATE_TITLE = "Nova tarefa";
const EDIT_TITLE = "Editar tarefa";
const CREATED_MESSAGE = "Tarefa criada";
const UPDATED_MESSAGE = "Tarefa atualizada";
const SAVE_ERROR_MESSAGE = "Não foi possível salvar a tarefa";
const DIALOG_MAX_WIDTH = "480px";

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

  const callbacks = {
    onSuccess: () => {
      setOpen(false);
      toast.success(task ? UPDATED_MESSAGE : CREATED_MESSAGE);
    },
    onError: () => toast.error(SAVE_ERROR_MESSAGE),
  };

  function handleSubmit(values: CreateTaskInput) {
    if (task) {
      updateTask.mutate({ id: task.id, ...values }, callbacks);
    } else {
      createTask.mutate(values, callbacks);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
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
