import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Reproduction: use cache + draftMode metadata boundary error</h1>
      <ul>
        <li>
          <Link href="/posts/1">Post 1</Link>
        </li>
        <li>
          <Link href="/posts/2">Post 2</Link>
        </li>
      </ul>
    </main>
  );
}
