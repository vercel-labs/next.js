import Link from "next/link";

export default function Home() {
  return (
    <ul>
      <li>
        <Link href="/p/widget">/p/widget</Link>
      </li>
      <li>
        <Link href="/p/widget?variant=red">/p/widget?variant=red</Link>
      </li>
    </ul>
  );
}
