import { notFound } from 'next/navigation'
export default async function About({ searchParams }) {
  const sp = await searchParams
  console.log('rendering about', sp)
  if (sp?.q === '404') notFound()
  return <main>about</main>
}
