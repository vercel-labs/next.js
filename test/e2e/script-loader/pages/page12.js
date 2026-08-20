import Link from 'next/link'

const Page = () => {
  return (
    <div className="container">
      <div id="page12">page12</div>
      <div>
        <Link href="/page11">Page11</Link>
      </div>
    </div>
  )
}

export default Page
