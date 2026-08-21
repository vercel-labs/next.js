export default async function Other({ params }) {
  const { lang } = await params
  return <h1 id="page">other {lang}</h1>
}
