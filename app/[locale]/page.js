export default async function Page({ params }) {
  const { locale } = await params
  return <p>Current locale: {locale}</p>
}
