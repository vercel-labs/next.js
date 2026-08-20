import type { Metadata } from 'next'

// Attempt to emit <meta http-equiv="refresh" content='5; URL="/target"'>
// via the Metadata API. `http-equiv` is documented as "unsupported metadata".
export const metadata: Metadata = {
  other: {
    'http-equiv': 'refresh',
    content: '5; URL="/target"',
  },
}

export default function Page() {
  return <p>metadata API attempt (http-equiv)</p>
}
