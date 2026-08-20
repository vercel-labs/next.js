import Image from 'next/image'

export default function Home() {
  return (
    <main>
      {/* Case A: exactly the issue snippet. Intrinsic file is 1884x447,
          declared width/height 300x32 (different aspect ratio),
          CSS: max-height 32px + width auto + height auto */}
      <div id="case-a">
        <Image
          className="max-h-32px w-auto h-auto"
          src="/23_store-dark.png"
          alt="logo A"
          width={300}
          height={32}
          priority
        />
      </div>

      {/* Case B: correct intrinsic width/height, only max-height + auto */}
      <div id="case-b">
        <Image
          className="max-h-32px w-auto h-auto"
          src="/23_store-dark.png"
          alt="logo B"
          width={1884}
          height={447}
          priority
        />
      </div>

      {/* Case C: container narrower than declared width, height auto
          (Preflight max-width:100% shrinks width only) */}
      <div id="case-c" className="narrow">
        <Image
          src="/23_store-dark.png"
          alt="logo C"
          width={300}
          height={71}
          priority
        />
      </div>
    </main>
  )
}
