import { Button, Card, Badge } from '@repo/ui'
import { range, sum } from '@repo/utils'
import { getDictionary } from '@repo/i18n'

export default function Page() {
  const dict = getDictionary('en')
  return (
    <div>
      <h1>{dict.home.title}</h1>
      <p>{dict.home.welcome}</p>
      <Card title="Stats">
        <Badge label={`range(10) sum = ${sum(...range(10))}`} />
        <Button>Click me</Button>
      </Card>
      <Card title="Grid">
        {range(20).map(i => <Badge key={i} label={`item ${i}`} />)}
      </Card>
    </div>
  )
}