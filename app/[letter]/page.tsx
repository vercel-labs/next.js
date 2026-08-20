export default async function LetterPage({ params }: { params: Promise<{ letter: string }> }) {
  const { letter } = await params
  console.log(`[letter]/page.tsx RENDER letter=${letter} at ${new Date().toISOString()}`)
  await new Promise((r) => setTimeout(r, 1000))
  return <h1>page: {letter}</h1>
}
