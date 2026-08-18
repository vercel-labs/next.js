export default async function Page({ params }) {
  const { lang } = await params
  return <p id="lang">{lang}</p>
}
