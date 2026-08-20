import singleton from '../../lib/singleton'
export function generateStaticParams() {
  return Array.from({ length: 100 }).map((_, i) => ({ slug: String(i) }))
}
export default function Page({ params }) {
  return <div>{singleton.value}</div>
}
