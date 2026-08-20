export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  // no params prebuilt -> no initialRevalidateSeconds in prerender-manifest
  return []
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <main>
      <h1>{slug}</h1>
      <p>rendered at {new Date().toISOString()} by server {process.env.SERVER_NAME}</p>
    </main>
  )
}
