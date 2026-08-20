import { Suspense } from "react";

async function Slug({ params }) {
  const { slug } = await params;
  return <p id="slug">{slug}</p>;
}

export default function SlugPage(props) {
  return (
    <Suspense fallback={<p>loading…</p>}>
      <Slug params={props.params} />
    </Suspense>
  );
}
