import Image from 'next/image'

export default function Page() {
  return (
    <main>
      <h1>next/image unoptimized={'{false}'} vs images.unoptimized: true</h1>
      <Image
        id="should-be-optimized"
        src="/test.png"
        alt="explicit unoptimized={false} - expected to go through /_next/image"
        width={200}
        height={200}
        unoptimized={false}
      />
      <Image
        id="inherits-config"
        src="/test.png"
        alt="no prop - inherits config, expected raw src"
        width={200}
        height={200}
      />
    </main>
  )
}
