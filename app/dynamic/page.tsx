import { connection } from 'next/server'

export default async function DynamicPage() {
  await connection()
  await new Promise((r) => setTimeout(r, 3000))
  return <h1>Dynamic page rendered at {Date.now()}</h1>
}
