import { notFound } from 'next/navigation';

export const revalidate = 5;

export async function generateStaticParams() {
  return [{ id: 'abc' }];
}

async function getPost(id) {
  const res = await fetch(`http://localhost:3041/post/${id}`, {
    next: { revalidate: 5 },
  });
  return res.json();
}

export default async function Page({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  if (post.status !== 'published') {
    notFound();
  }
  return (
    <h1>
      Post {id} is published (generated at {new Date().toISOString()})
    </h1>
  );
}
