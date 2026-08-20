import Link from 'next/link'
export default function Slug({ slug }) {
  return (
    <div>
      <h1 id="slug">slug: {slug}</h1>
      <p><Link id="lhome" href="/">Home button</Link></p>
    </div>
  )
}
export function getServerSideProps({ params }) {
  return { props: { slug: params.slug } }
}
