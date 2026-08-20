import Image from 'next/image'

export default function Page() {
  return (
    <main>
      {[0, 1, 2].map((i) => (
        <Image
          key={i}
          src={`/photo${i}.jpg`}
          alt=""
          width={4000}
          height={3000}
          sizes="100vw"
        />
      ))}
    </main>
  )
}
