// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TaskForm } from "@/components/task-form";
import { DESCRICAO_MAX_LENGTH } from "@/server/tasks/task.schema";

const TITULO_REQUIRED_MESSAGE = "O título é obrigatório";

function renderForm(props: Partial<Parameters<typeof TaskForm>[0]> = {}) {
  const onSubmit = vi.fn();
  const user = userEvent.setup();
  render(<TaskForm onSubmit={onSubmit} isSubmitting={false} {...props} />);
  return {
    user,
    onSubmit,
    titulo: screen.getByLabelText("Título"),
    descricao: screen.getByLabelText("Descrição (opcional)"),
    submitButton: screen.getByRole("button"),
  };
}

afterEach(cleanup);

describe("TaskForm", () => {
  it("starts empty with the submit button disabled", () => {
    const { titulo, descricao, submitButton } = renderForm();

    expect(titulo).toHaveProperty("value", "");
    expect(descricao).toHaveProperty("value", "");
    expect(submitButton).toHaveProperty("disabled", true);
  });

  it("shows the required message and blocks submit for a whitespace-only title", async () => {
    const { user, titulo, submitButton, onSubmit } = renderForm();

    await user.type(titulo, "   ");
    await user.tab();

    expect(await screen.findByText(TITULO_REQUIRED_MESSAGE)).toBeTruthy();
    expect(titulo.getAttribute("aria-invalid")).toBe("true");
    expect(submitButton).toHaveProperty("disabled", true);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits the values parsed by the schema", async () => {
    const { user, titulo, descricao, submitButton, onSubmit } = renderForm();

    await user.type(titulo, "  Comprar pão  ");
    await user.type(descricao, "   ");
    await user.click(submitButton);

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        { titulo: "Comprar pão" },
        expect.anything(),
      ),
    );
  });

  it("does not submit when the description is too long", async () => {
    const { user, titulo, descricao, submitButton, onSubmit } = renderForm();

    await user.type(titulo, "Ler");
    await user.click(descricao);
    await user.paste("a".repeat(DESCRICAO_MAX_LENGTH + 1));
    await user.click(submitButton);

    expect(
      await screen.findByText(
        `A descrição deve ter no máximo ${DESCRICAO_MAX_LENGTH} caracteres`,
      ),
    ).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("starts filled when editing and submits the changed values", async () => {
    const { user, titulo, descricao, submitButton, onSubmit } = renderForm({
      defaultValues: {
        titulo: "Revisar relatório",
        descricao: "Conferir os números",
      },
    });

    expect(titulo).toHaveProperty("value", "Revisar relatório");
    expect(descricao).toHaveProperty("value", "Conferir os números");

    await user.clear(titulo);
    await user.type(titulo, "Revisar relatório mensal");
    await user.click(submitButton);

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          titulo: "Revisar relatório mensal",
          descricao: "Conferir os números",
        },
        expect.anything(),
      ),
    );
  });

  it("shows the loading state and disables the fields while submitting", () => {
    const { titulo, descricao, submitButton } = renderForm({
      isSubmitting: true,
      defaultValues: { titulo: "Ler" },
    });

    expect(submitButton.textContent).toBe("Salvando...");
    expect(submitButton.closest("fieldset")).toHaveProperty("disabled", true);
    expect(titulo.matches(":disabled")).toBe(true);
    expect(descricao.matches(":disabled")).toBe(true);
  });

  it("focuses the field when its label is clicked", async () => {
    const { user, descricao } = renderForm();

    await user.click(screen.getByText("Descrição (opcional)"));

    expect(document.activeElement).toBe(descricao);
  });
});
