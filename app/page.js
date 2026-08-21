import Client from './client'

export async function generateMetadata() {
  return {
    title: 'My Title',
    description: 'My Description',
  }
}

export default async function Page() {
  return (
    <main>
      <h1>Home</h1>
      <Client />
    </main>
  )
}
