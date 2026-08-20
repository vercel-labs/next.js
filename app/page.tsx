import Link from "next/link";

export default function Home() {
  return (
    <ul>
      <li>
        <Link href="/products#category-42">
          <code>/products#category-42</code>
        </Link>
      </li>
      <li>
        <Link href="/products-with-suspense#category-42">
          <code>/products-with-suspense#category-42</code>
        </Link>
      </li>
    </ul>
  );
}
