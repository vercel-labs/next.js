import db from './db'

export function generateStaticParams() {
  console.log('generateStaticParams executed')
  return [{ slug: 'first' }]
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  void db

  return <p>{(await params).slug}</p>
}
