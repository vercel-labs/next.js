import { notFound } from 'next/navigation'
export default async function Page({ params }) { const { slug } = await params; if (slug !== 'ok') notFound(); return <p>deep {slug}</p> }
