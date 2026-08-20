import Link from 'next/link'

export default function Index() {
  return (
    <div>
      <div id="page">index</div>
      <Link href="/data" id="to-data">
        to data
      </Link>
    </div>
  )
}
