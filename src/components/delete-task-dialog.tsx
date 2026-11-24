"use client";

import { TrashIcon } from "@radix-ui/react-icons";
import { AlertDialog, Button, Flex, IconButton } from "@radix-ui/themes";
import { useState } from "react";

import { useToast } from "@/components/toast/use-toast";
import type { Task } from "@/server/tasks/task.schema";
import { isNotFoundError, useDeleteTask } from "@/trpc/tasks";

const DELETED_MESSAGE = "Tarefa excluída";
const DELETE_ERROR_MESSAGE = "Não foi possível excluir a tarefa";
const DIALOG_MAX_WIDTH = "420px";

type DeleteTaskDialogProps = {
  task: Task;
};

export function DeleteTaskDialog({ task }: DeleteTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const toast = useToast();
  const deleteTask = useDeleteTask();

  function handleOpenChange(nextOpen: boolean) {
    if (!deleteTask.isPending) setOpen(nextOpen);
  }

  function handleConfirm() {
    deleteTask.mutate(
      { id: task.id },
      {
        onSuccess: () => toast.success(DELETED_MESSAGE),
        onError: (error) =>
          toast.error(
            isNotFoundError(error) ? error.message : DELETE_ERROR_MESSAGE,
          ),
        onSettled: () => setOpen(false),
      },
    );
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={handleOpenChange}>
      <AlertDialog.Trigger>
        <IconButton
          size="1"
          variant="soft"
          color="red"
          aria-label={`Excluir tarefa ${task.titulo}`}
        >
          <TrashIcon />
        </IconButton>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth={DIALOG_MAX_WIDTH}>
        <AlertDialog.Title>Excluir tarefa</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Tem certeza que deseja excluir &quot;{task.titulo}&quot;? Essa ação
          não pode ser desfeita.
        </AlertDialog.Description>
        <Flex gap="3" justify="end" mt="4">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray" disabled={deleteTask.isPending}>
              Cancelar
            </Button>
          </AlertDialog.Cancel>
          <Button
            color="red"
            loading={deleteTask.isPending}
            onClick={handleConfirm}
          >
            Excluir
          </Button>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
