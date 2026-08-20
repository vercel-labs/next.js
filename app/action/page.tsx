import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return { title: 'action page' }
}

async function doAction(formData: FormData) {
  'use server'
  const c = await cookies()
  c.set('hit', String(formData.get('name') ?? 'x'))
  await fetch('https://example.com', { cache: 'no-store' }).catch(() => {})
  revalidatePath('/action')
}

export default async function Page() {
  return (
    <form action={doAction}>
      <input name="name" defaultValue="eve" />
      <button id="submit" type="submit">go</button>
    </form>
  )
}
