import Image from "next/image"

const cases = [
  "/api/node-static",
  "/api/node-dynamic/abc",
  "/api/node-buffer/abc",
  "/api/edge-static",
  "/api/edge-dynamic/abc",
  "/api/edge-buffer/abc",
]

export default function Home() {
  return (
    <div>
      {cases.map((src) => (
        <div key={src}>
          <p>{src}</p>
          <Image src={src} width={200} height={200} alt={src} unoptimized={false} />
        </div>
      ))}
    </div>
  )
}
