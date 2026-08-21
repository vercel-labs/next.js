export default async function Page({ params }) {
  const { lang } = await params
  return <h1 id="page">home {lang}</h1>
}
