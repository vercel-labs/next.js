import { useRouter } from 'next/router'

export default function Detail() {
  const router = useRouter()
  const { id, fromId } = router.query
  return (
    <div>
      <p id="pathname">{router.pathname}</p>
      <p id="aspath">{router.asPath}</p>
      <p id="id">id: {String(id)}</p>
      <p id="fromId">fromId: {String(fromId)}</p>
      <button
        id="push-b"
        onClick={() => router.push({ query: { id: 'b', fromId: id } })}
      >
        push to [b] page
      </button>
      <button
        id="push-c"
        onClick={() => router.push({ query: { id: 'c', fromId: id } })}
      >
        push to [c] page
      </button>
    </div>
  )
}
