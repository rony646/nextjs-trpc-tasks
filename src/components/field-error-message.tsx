import { Text } from "@radix-ui/themes";
import type { FieldError } from "react-hook-form";

type FieldErrorMessageProps = {
  id: string;
  error?: FieldError;
};

export function FieldErrorMessage({ id, error }: FieldErrorMessageProps) {
  if (!error) return null;

  return (
    <Text as="p" id={id} size="2" color="red">
      {error.message}
    </Text>
  );
}
