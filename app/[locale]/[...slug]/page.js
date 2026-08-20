export default async function Page({ params }) {
  const { locale, slug } = await params
  return (
    <p id="catchall">
      catch-all: locale={String(locale)} slug={JSON.stringify(slug ?? null)}
    </p>
  )
}
