import { Card, Button } from '@repo/ui'
import { getDictionary } from '@repo/i18n'

export default function Page() {
  const dict = getDictionary('en')
  return <div><h1>{dict.contact.title}</h1><Card title="Form"><Button>{dict.contact.send}</Button></Card></div>
}