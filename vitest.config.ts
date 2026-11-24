import { defineConfig } from "vitest/config";

// tsconfig keeps JSX as is for Next.js, so the tests compile it themselves.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  oxc: { jsx: { runtime: "automatic" } },
});
