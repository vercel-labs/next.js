import Image from 'next/image'

export default function Page() {
  return (
    <main>
      <h2>next/image</h2>
      <Image id="next-image" src="/test.png" alt="test" width={200} height={200} unoptimized={false} />
      <h2>plain img</h2>
      <img id="plain-img" src="/test.png" alt="test" width={200} height={200} />
    </main>
  )
}
