"use client";

import { Text } from "@radix-ui/themes";

import { TaskItem } from "@/components/task-item";
import { useTaskList } from "@/trpc/tasks";

export function TaskList() {
  const { data } = useTaskList();

  if (data.items.length === 0) {
    return (
      <Text as="p" color="gray">
        Nenhuma tarefa ainda
      </Text>
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
