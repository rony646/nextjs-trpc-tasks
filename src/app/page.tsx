import { Button, Flex, Heading } from "@radix-ui/themes";

import { TaskFormDialog } from "@/components/task-form-dialog";
import { TaskList } from "@/components/task-list";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { taskListOptions } from "@/trpc/tasks";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await getQueryClient().infiniteQuery(taskListOptions(trpc));

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <Flex justify="between" align="center">
        <Heading as="h1" size="7">
          Tarefas
        </Heading>
        <TaskFormDialog trigger={<Button size="3">Nova tarefa</Button>} />
      </Flex>
      <HydrateClient>
        <TaskList />
      </HydrateClient>
    </main>
  );
}
