import { Suspense } from "react";

export function generateStaticParams() {
  return [{ slug: "hello world" }, { slug: "hello%20world%20encoded" }];
}

async function Slug({ params }) {
  const { slug } = await params;
  return <p id="slug">{slug}</p>;
}

export default function Slug2Page(props) {
  return (
    <Suspense fallback={<p>loading…</p>}>
      <Slug params={props.params} />
    </Suspense>
  );
}
