import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { read } from "../../../db";

export default function Page(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p>loading</p>}>
      <Detail {...props} />
    </Suspense>
  );
}

async function Detail(props: { params: Promise<{ id: string }> }) {
  "use cache";
  const { id } = await props.params;
  const p = read()[id];
  console.log(`[render] id=${id} found=${!!p}`);
  if (!p) {
    notFound();
  }
  cacheLife("max");
  cacheTag(`pokemon-${id}`);
  return <h1 id="name">{p.name}</h1>;
}
