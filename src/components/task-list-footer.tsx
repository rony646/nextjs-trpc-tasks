import { Button, Flex, Spinner, Text } from "@radix-ui/themes";

type TaskListFooterProps = {
  isLoading: boolean;
  hasError: boolean;
  hasNextPage: boolean;
  onRetry: () => void;
};

export function TaskListFooter({
  isLoading,
  hasError,
  hasNextPage,
  onRetry,
}: TaskListFooterProps) {
  if (isLoading) return <Spinner aria-label="Carregando mais tarefas" />;

  if (hasError) {
    return (
      <Flex direction="column" align="center" gap="2" role="alert">
        <Text size="2" color="red">
          Não foi possível carregar mais tarefas
        </Text>
        <Button size="1" variant="soft" onClick={onRetry}>
          Tentar novamente
        </Button>
      </Flex>
    );
  }

  if (!hasNextPage) {
    return (
      <Text size="2" color="gray">
        Não há mais tarefas
      </Text>
    );
  }

  return null;
}
