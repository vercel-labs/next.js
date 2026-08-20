import { startTransition, useTransition } from "react";

async function addItem(id: string): Promise<void> {}

export function ExampleClientComponent({ id }: { id: string }) {
  const [isPending, start] = useTransition();
  return (
    <>
      <button onClick={() => startTransition(() => addItem(id))}>A</button>
      <button onClick={() => start(() => addItem(id))}>B</button>
      <button onClick={() => startTransition(async () => { await addItem(id); })}>C</button>
    </>
  );
}
