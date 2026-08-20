import { createInvoice } from './lib/actions'

export default async function Page() {
  await createInvoice()
  return <main>Hello Main Page</main>
}
