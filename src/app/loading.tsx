import { Heading, Skeleton } from "@radix-ui/themes";

const SKELETON_COUNT = 3;
const SKELETON_HEIGHT = "88px";

export default function Loading() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <Heading as="h1" size="7">
        Tarefas
      </Heading>
      <ul className="flex flex-col gap-3" aria-busy="true">
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <li key={index}>
            <Skeleton height={SKELETON_HEIGHT} />
          </li>
        ))}
      </ul>
    </main>
  );
}
