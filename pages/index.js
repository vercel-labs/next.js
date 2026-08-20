const isNode = typeof Buffer !== 'undefined'

export default function Home() {
  return <p>isNode: {String(isNode)}</p>
}
