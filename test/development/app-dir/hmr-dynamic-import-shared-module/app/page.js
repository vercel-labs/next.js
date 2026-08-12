import { getMessages } from '../lib/messages'

export default async function Page() {
  const messages = await getMessages()

  return <p id="subtitle">{messages.Home.subtitle}</p>
}
