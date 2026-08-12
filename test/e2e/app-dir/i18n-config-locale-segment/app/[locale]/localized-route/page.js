export default async function Page({ params }) {
  const { locale } = await params
  return (
    <p id="page">app/[locale]/localized-route/page.js locale: {locale}</p>
  )
}
