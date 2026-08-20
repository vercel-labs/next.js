import { hello } from '@repro/native'

export const dynamic = 'force-dynamic'

export default function Home() {
  return <p>{hello()}</p>
}
