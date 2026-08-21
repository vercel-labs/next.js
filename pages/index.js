import Link from "next/link";

export default function Home() {
  return (
    <ul>
      <li><Link href="/pages-router">Pages Router plain img (preload lands in body)</Link></li>
      <li><a href="/app-router">App Router plain img (no preload)</a></li>
    </ul>
  );
}
