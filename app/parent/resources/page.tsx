import Link from 'next/link';

export default async function Resources() {
  await new Promise((r) => setTimeout(r, 800));
  return (
    <ul data-testid="resources-list">
      {['1', '2', '3'].map((id) => (
        <li key={id}>
          <Link data-testid={`link-${id}`} href={`/parent/resources/${id}`}>
            Resource {id}
          </Link>
        </li>
      ))}
    </ul>
  );
}
