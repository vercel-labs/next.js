export default async function Login({ params }) {
  const { locale } = await params
  return <h1 id="login">Login page, locale = {locale}</h1>
}
