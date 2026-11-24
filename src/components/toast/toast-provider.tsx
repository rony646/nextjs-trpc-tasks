"use client";

import * as Toast from "@radix-ui/react-toast";
import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const TOAST_DURATION_MS = 5000;

type ToastVariant = "success" | "error";

type ToastItem = {
  id: number;
  variant: ToastVariant;
  message: string;
};

type ToastApi = {
  success: (message: string) => void;
  error: (message: string) => void;
};

// Errors interrupt the screen reader; successes wait until it is idle.
const VARIANTS = {
  success: {
    icon: "✓",
    announce: "background",
    className: "border-green-600 bg-green-50 text-green-900",
  },
  error: {
    icon: "✕",
    announce: "foreground",
    className: "border-red-600 bg-red-50 text-red-900",
  },
} as const satisfies Record<
  ToastVariant,
  { icon: string; announce: Toast.ToastProps["type"]; className: string }
>;

export const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const show = useCallback((variant: ToastVariant, message: string) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, variant, message }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => show("success", message),
      error: (message) => show("error", message),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={api}>
      <Toast.Provider duration={TOAST_DURATION_MS}>
        {children}
        {toasts.map(({ id, variant, message }) => {
          const { icon, announce, className } = VARIANTS[variant];
          return (
            <Toast.Root
              key={id}
              type={announce}
              onOpenChange={(open) => !open && remove(id)}
              className={`flex items-center gap-3 rounded-md border-l-4 p-4 shadow-lg ${className}`}
            >
              <span aria-hidden className="font-bold">
                {icon}
              </span>
              <Toast.Title className="flex-1 text-sm font-medium">
                {message}
              </Toast.Title>
              <Toast.Close
                aria-label="Close"
                className="rounded px-2 opacity-70 hover:opacity-100"
              >
                ✕
              </Toast.Close>
            </Toast.Root>
          );
        })}
        <Toast.Viewport className="fixed right-0 bottom-0 z-50 flex w-96 max-w-full flex-col gap-2 p-4 outline-none" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
