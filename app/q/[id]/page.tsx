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
  cacheLife("max");
  cacheTag(`pokemon-${id}`); // tag registered BEFORE the notFound() throw
  console.log("[cache miss] /q rendering detail for id", id);
  const p = read()[id];
  if (!p) {
    notFound();
  }
  return <h1 id="name">{p.name}</h1>;
}
