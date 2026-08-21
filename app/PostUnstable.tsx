import { unstable_cache } from 'next/cache'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const currentReadableTime = () => new Date().toLocaleTimeString()
const url = 'https://jsonplaceholder.typicode.com/posts/1'

const getPosts = unstable_cache(
  async () => {
    const res = await fetch(url)
    const data = await res.json()
    await delay(2000)
    console.log('[unstable_cache MISS] ran callback at', currentReadableTime())
    return { time: currentReadableTime(), post: data }
  },
  ['temperature-data'],
  { revalidate: 5, tags: ['temperature'] }
)

export const PostUnstable = async () => {
  const { post, time } = await getPosts()
  return (
    <div>
      <p>unstable_cache time: <span id="unstable-time">{time}</span></p>
      <div>{JSON.stringify(post).slice(0, 40)}</div>
    </div>
  )
}
