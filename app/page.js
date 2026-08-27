import { Form } from './form'
import { Badge } from './badge'
import { total } from './shared'
export const dynamic = 'force-dynamic'
export default async function Page() {
  return (
    <main>
      <h1 id="ts">{Date.now() + total * 0}</h1>
      <Form badge={<Badge label="server-passed-client-element" />}>
        <Badge label="child" />
      </Form>
      <a href="/dialog">dialog</a>
    </main>
  )
}
