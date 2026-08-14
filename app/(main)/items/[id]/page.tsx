import { notFound } from 'next/navigation';

export default async function Item({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id !== 'a') notFound();
  return <main>item {id}</main>;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `item ${id}` };
}
