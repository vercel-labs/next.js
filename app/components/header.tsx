async function getData() {
  'use cache'
  return { message: 'Hello there' }
}

export default async function Header() {
  const data = await getData()
  return <h1>{data.message}</h1>
}
