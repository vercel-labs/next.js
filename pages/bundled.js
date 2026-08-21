import Image from 'next/image'

export default function BundledPage() {
  return (
    <main>
      <h1>next/image imported by the page itself</h1>
      <Image
        src="https://picsum.photos/id/101/1200/800"
        alt="repro"
        width={1200}
        height={800}
        quality={90}
      />
    </main>
  )
}

export async function getServerSideProps() {
  return { props: {} }
}
