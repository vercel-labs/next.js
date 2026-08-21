import Image from 'next/image'

export default function Page() {
  return (
    <main>
      <h1>basePath + public folder image</h1>
      <Image id="next-image" src="/next.svg" alt="via next/image" width={200} height={100} />
      <img id="plain-img" src="/next.svg" alt="via plain img" width={200} height={100} />
    </main>
  )
}
