import { Card } from '@repo/ui'
import { getDictionary } from '@repo/i18n'

export default function Page() {
  const dict = getDictionary('en')
  return <div><h1>{dict.about.title}</h1><Card title={dict.about.ourStory}><p>This is a reproduction repo for a Turbopack livelock bug.</p></Card></div>
}