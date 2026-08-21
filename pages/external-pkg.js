import { PkgImage } from 'external-image-pkg'

export default function ExternalPkgPage() {
  return (
    <main>
      <h1>next/image from an external package</h1>
      <PkgImage
        src="https://picsum.photos/id/100/1200/800"
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
