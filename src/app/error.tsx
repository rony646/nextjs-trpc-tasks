"use client";

import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type ErrorPageProps = {
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  const router = useRouter();
  const [isRetrying, startTransition] = useTransition();

  // refresh() runs the server fetch again; reset() then re-renders the page with the new data.
  function retry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <Heading as="h1" size="7">
        Tarefas
      </Heading>
      <Flex direction="column" align="center" gap="3" py="9" role="alert">
        <Text as="p" color="red">
          Não foi possível carregar as tarefas
        </Text>
        <Button variant="soft" loading={isRetrying} onClick={retry}>
          Tentar novamente
        </Button>
      </Flex>
    </main>
  );
}
