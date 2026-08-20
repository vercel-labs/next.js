import Link from "next/link";

export default function Index() {
  return (
    <div>
      <h1 id="page">index</h1>
      <p>
        <Link href="/data">Link to /data</Link>
      </p>
    </div>
  );
}
