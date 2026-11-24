import { Pencil1Icon } from "@radix-ui/react-icons";
import { Card, Flex, Heading, IconButton, Text } from "@radix-ui/themes";

import { TaskFormDialog } from "@/components/task-form-dialog";
import type { Task } from "@/server/tasks/task.schema";

// Fixed time zone so the server and the browser render the same text and hydration matches.
const DISPLAY_TIME_ZONE = "America/Sao_Paulo";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: DISPLAY_TIME_ZONE,
});

type TaskItemProps = {
  task: Task;
};

export function TaskItem({ task }: TaskItemProps) {
  return (
    <Card size="2">
      <Flex direction="column" gap="1">
        <Flex justify="between" align="start" gap="3">
          <Heading as="h2" size="3">
            {task.titulo}
          </Heading>
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
