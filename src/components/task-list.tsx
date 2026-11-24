"use client";

import { Button, Flex, Text } from "@radix-ui/themes";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { TaskFormDialog } from "@/components/task-form-dialog";
import { TaskItem } from "@/components/task-item";
import { TaskListFooter } from "@/components/task-list-footer";
import { useTaskList } from "@/trpc/tasks";

// Start loading the next page a bit before the user reaches the end.
const PRELOAD_MARGIN = "200px";

export function TaskList() {
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useTaskList();
  const { ref: endOfListRef, inView: isEndOfListVisible } = useInView({
    rootMargin: PRELOAD_MARGIN,
  });

  const shouldLoadNextPage =
    isEndOfListVisible &&
    hasNextPage &&
    !isFetchingNextPage &&
    !isFetchNextPageError;

  useEffect(() => {
    if (shouldLoadNextPage) fetchNextPage();
  }, [shouldLoadNextPage, fetchNextPage]);

  const tasks = data.pages.flatMap((page) => page.items);

  if (tasks.length === 0) {
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
    <Flex direction="column" gap="4">
      <ul className="flex flex-col gap-3">
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskItem task={task} />
          </li>
        ))}
      </ul>
      <Flex ref={endOfListRef} justify="center" py="2">
        <TaskListFooter
          isLoading={isFetchingNextPage}
          hasError={isFetchNextPageError}
          hasNextPage={hasNextPage}
          onRetry={() => fetchNextPage()}
        />
      </Flex>
    </Flex>
  );
}
