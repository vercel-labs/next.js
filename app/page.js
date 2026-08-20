import Image from 'next/image'

const HOST = process.env.UPSTREAM_ORIGIN || 'http://127.0.0.1:4001'

// `slow` answers after 8s, i.e. above the hard-coded 7s timeout in
// next/dist/server/image-optimizer.js -> fetchExternalImage().
const slow = `${HOST}/slow.jpg?delay=8000`
const flaky = `${HOST}/flaky.jpg`
const fast = `${HOST}/fast.jpg`

export default function Page() {
  return (
    <main style={{ fontFamily: 'monospace', padding: 24, lineHeight: 2 }}>
      <h2>next/image (served through /_next/image)</h2>
      <div>
        slow upstream (8s):{' '}
        <Image src={slow} alt="slow via next/image" width={64} height={64} priority />
      </div>
      <div>
        flaky upstream:{' '}
        <Image src={flaky} alt="flaky via next/image" width={64} height={64} priority />
      </div>
      <div>
        healthy upstream:{' '}
        <Image src={fast} alt="fast via next/image" width={64} height={64} priority />
      </div>

      <h2>plain img (browser loads the upstream directly)</h2>
      <div>
        slow upstream (8s): <img src={slow} alt="slow via img" width={64} height={64} />
      </div>
    </main>
  )
}
