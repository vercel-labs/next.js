import { ClientButton } from './client-button'

export const dynamic = 'force-dynamic'

export default async function Page() {
  // A closure variable makes Next.js encrypt the bound args of the inline
  // Server Action with AES-GCM (server/app-render/encryption-utils.ts).
  const secret = 'bound-closure-value'

  async function action() {
    'use server'
    return 'action ran with: ' + secret
  }

  return (
    <main>
      <h1>next 14.2.23 server action bound args</h1>
      <ClientButton action={action} />
    </main>
  )
}
