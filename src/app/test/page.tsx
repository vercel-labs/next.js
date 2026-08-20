import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Test</h1>

      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/test">Test</Link>
        </li>
      </ul>
    </main>
  );
}
