import { Card, Badge, Table, Spinner } from '@repo/ui'
import { range, groupBy } from '@repo/utils'

export default function Page() {
  const data = range(50).map(i => ({ id: i, group: `g${i % 5}`, value: i * 10 }))
  const groups = groupBy(data, d => d.group)
  return (
    <div>
      <h1>Dashboard</h1>
      <Card title="Overview"><Spinner /></Card>
      {Object.entries(groups).map(([key, items]) => (
        <Card key={key} title={`Group ${key}`}>
          <Badge label={`${items.length} items`} />
          <Table rows={items.map(d => [String(d.id), d.group, String(d.value)])} />
        </Card>
      ))}
    </div>
  )
}