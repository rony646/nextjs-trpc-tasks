import { Pencil1Icon } from "@radix-ui/react-icons";
import { Card, Flex, Heading, IconButton, Text } from "@radix-ui/themes";

import { DeleteTaskDialog } from "@/components/delete-task-dialog";
import { TaskFormDialog } from "@/components/task-form-dialog";
import type { Task } from "@/server/tasks/task.schema";

// Fixed time zone so the server and the browser render the same text and hydration matches.
const DISPLAY_TIME_ZONE = "America/Sao_Paulo";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: DISPLAY_TIME_ZONE,
});

// Radix paints the card background on ::before from this variable, so the transition goes there.
const CARD_HOVER_CLASS_NAME =
  "before:transition-colors before:duration-200 before:ease-in-out hover:[--card-background-color:var(--gray-2)]";

type TaskItemProps = {
  task: Task;
};

export function TaskItem({ task }: TaskItemProps) {
  return (
    <Card size="2" className={CARD_HOVER_CLASS_NAME}>
      <Flex direction="column" gap="1">
        <Flex justify="between" align="start" gap="3">
          <Heading as="h2" size="3">
            {task.titulo}
          </Heading>
          <Flex gap="2" flexShrink="0">
            <TaskFormDialog
              task={task}
              trigger={
                <IconButton
                  size="1"
                  variant="soft"
                  aria-label={`Editar tarefa ${task.titulo}`}
                >
                  <Pencil1Icon />
                </IconButton>
              }
            />
            <DeleteTaskDialog task={task} />
          </Flex>
        </Flex>
        {task.descricao && (
          <Text as="p" size="2" color="gray">
            {task.descricao}
          </Text>
        )}
        <Text size="1" color="gray">
          Criada em{" "}
          <time dateTime={task.dataCriacao.toISOString()}>
            {dateFormatter.format(task.dataCriacao)}
          </time>
        </Text>
      </Flex>
    </Card>
  );
}
