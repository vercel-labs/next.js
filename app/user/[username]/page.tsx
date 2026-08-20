export default async function User({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  return <div>{username}</div>
}
