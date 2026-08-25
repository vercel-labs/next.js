import { Card } from '@repo/ui'
import { getDictionary } from '@repo/i18n'

export default function Page() {
  const dict = getDictionary('en')
  return <div><h1>{dict.docs.title}</h1><Card title={dict.docs.gettingStarted}><p>Follow these steps.</p></Card></div>
}