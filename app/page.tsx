import Link from 'next/link';

export default function Home() {
  return (
    <ul>
      <li>
        <Link href="/items/missing">/items/missing (calls notFound() - crashes)</Link>
      </li>
      <li>
        <Link href="/items/a">/items/a (exists - fine)</Link>
      </li>
    </ul>
  );
}
