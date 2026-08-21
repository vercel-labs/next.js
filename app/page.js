import { headers } from 'next/headers'

export default async function Home() {
  console.log(await headers())
  return <h1>Hello world!</h1>
}
