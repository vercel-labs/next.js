export default async function CatchAll({ params }) {
  const { segment } = await params
  return <main>Catch-all: {segment.join('/')}</main>
}
