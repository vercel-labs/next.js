export default async function Page({ params }) {
  const { locale } = await params
  return <p id="page">locale page: {locale}</p>
}
