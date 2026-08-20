export default async function Favorite({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const res = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu', {
    cache: 'no-store',
  }).catch(() => null)
  return (
    <p>
      lang: {lang} / fetch ok: {String(Boolean(res))}
    </p>
  )
}
