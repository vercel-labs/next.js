import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">home</Link>
        </li>
        <li>
          <Link href="/johnny">johnny</Link>
        </li>
      </ul>
    </nav>
  );
}
