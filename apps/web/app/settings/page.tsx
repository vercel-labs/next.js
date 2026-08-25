import { Card, Button, Badge } from '@repo/ui'
import { getDictionary } from '@repo/i18n'

export default function Page() {
  const dict = getDictionary('en')
  return (
    <div>
      <h1>{dict.settings.title}</h1>
      <Card title={dict.settings.profile}><Button>Edit</Button></Card>
      <Card title={dict.settings.notifications}><Badge label="on" /></Card>
    </div>
  )
}