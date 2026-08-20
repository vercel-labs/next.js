import Link from "next/link";
import { Counter } from "../counter";

export default async function Page({
  params,
}: {
  params: Promise<{ catchAll?: string[] }>;
}) {
  const { catchAll } = await params;
  // artificial delay so the loading.tsx boundary is observable
  await new Promise((r) => setTimeout(r, 1500));
  return (
    <div>
      <p id="params">params: {JSON.stringify(catchAll ?? [])}</p>
      <Counter />
      <br />
      <Link id="open-modal" href="/photo/1">
        + open modal (parallel slot only)
      </Link>
    </div>
  );
}
