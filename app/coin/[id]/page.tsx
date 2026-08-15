import Link from 'next/link'
import Info from './info'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  return { title: id.charAt(0).toUpperCase() + id.slice(1) }
}

export default async function CoinPage({ params }: Props) {
  const { id } = await params
  return (
    <>
      <Info coinId={id} />
      <Link href="/" id="back">back</Link>
    </>
  )
}
