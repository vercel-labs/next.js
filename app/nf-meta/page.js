import { notFound } from 'next/navigation'
export async function generateMetadata() {
  notFound()
}
export default function Page() {
  return <p>never</p>
}
