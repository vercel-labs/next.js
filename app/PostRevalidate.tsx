const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const currentReadableTime = () => new Date().toLocaleTimeString()

export const PostRevalidate = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
    next: { revalidate: 5 },
  })
  const post = await res.json()
  await delay(2000)
  console.log('[fetch revalidate] rendered at', currentReadableTime())
  return (
    <div>
      <p>fetch revalidate time: <span id="revalidate-time">{currentReadableTime()}</span></p>
      <div>{JSON.stringify(post).slice(0, 40)}</div>
    </div>
  )
}
