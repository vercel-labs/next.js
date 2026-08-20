import { notFound } from 'next/navigation'
export default async function Page({ params }) { const { slug } = await params; if (slug[0] !== 'ok') notFound(); return <p>catch {slug.join('/')}</p> }
