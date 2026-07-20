async function getGreeting() {
  return 'hello world'
}

export default async function Page() {
  const greeting = await getGreeting()

  return <h1>{greeting}</h1>
}
