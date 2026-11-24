import { Theme } from "@radix-ui/themes";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ToastProvider } from "@/components/toast/toast-provider";
import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tarefas",
  description: "Gerenciador de tarefas simples com Next.js e tRPC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} antialiased`}>
        {/* Outside Theme: its root is a stacking context, so toasts inside it would render under open dialogs. */}
        <ToastProvider>
          <Theme appearance="light">
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </Theme>
        </ToastProvider>
      </body>
    </html>
  );
}
