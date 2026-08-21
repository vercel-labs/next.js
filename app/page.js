import Link from 'next/link';

export default function Home() {
  const ids = ['1', '2', '3', '4', '5'];
  return (
    <main>
      <h1>Home</h1>
      <ul>
        {ids.map((id) => (
          <li key={id}>
            <Link href={`/item/${id}`}>Item {id}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
