type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  return { title: id.charAt(0).toUpperCase() + id.slice(1) }
}

export default async function CoinPage({ params }: Props) {
  const { id } = await params
  return <h1 id="coin">{id}</h1>
}
