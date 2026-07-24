import Link from "next/link";
export default function Home() {
  return (
    <main>
      <p>Click through to /slow (a client navigation): the counter WORKS.</p>
      <p>Then reload /slow directly: the counter is DEAD (never hydrates).</p>
      <Link href="/slow">go to /slow</Link>
    </main>
  );
}
