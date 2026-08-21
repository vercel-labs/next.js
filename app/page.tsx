import { draftMode } from 'next/headers'

export default async function Page() {
  const { isEnabled } = await draftMode()
  return <p>page draftMode().isEnabled: {String(isEnabled)}</p>
}
