import { Suspense } from "react";

export function generateStaticParams() {
  return [
    { slug: "hello world" },
    { slug: "50% off" },
    { slug: "ünïcode" },
    { slug: "a+b" },
  ];
}

async function Slug({ params }) {
  const { slug } = await params;
  return <p id="slug">{slug}</p>;
}

export default function Page(props) {
  return (
    <Suspense fallback={<p>loading…</p>}>
      <Slug params={props.params} />
    </Suspense>
  );
}
