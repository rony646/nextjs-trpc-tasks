"use client";

import { Button, Flex, Text } from "@radix-ui/themes";

import { TaskFormDialog } from "@/components/task-form-dialog";
import { TaskItem } from "@/components/task-item";
import { useTaskList } from "@/trpc/tasks";

export function TaskList() {
  const { data } = useTaskList();

  if (data.items.length === 0) {
    return (
      <Flex direction="column" align="center" gap="3" py="9">
        <Text as="p" color="gray">
          Nenhuma tarefa ainda
        </Text>
        <TaskFormDialog
          trigger={<Button variant="soft">Criar primeira tarefa</Button>}
        />
      </Flex>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {data.items.map((task) => (
        <li key={task.id}>
          <TaskItem task={task} />
        </li>
      ))}
    </ul>
  );
}
