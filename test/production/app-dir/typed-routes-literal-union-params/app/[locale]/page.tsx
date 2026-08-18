type Locale = 'en' | 'de'

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params

  return <p id="locale">{locale}</p>
}
