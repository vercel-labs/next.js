import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `entity ${id}` };
}

export default async function Entity({ params }) {
  const { id } = await params;
  if (id !== 'ok') notFound();
  return <div id="entity">entity {id}</div>;
}
