import { Card, Badge, Button, Table } from '@repo/ui'
import { formatCurrency } from '@repo/utils'
import type { Product } from '@repo/types'

const products: Product[] = [
  { id: 'p1', name: 'Widget', price: 29.99, currency: 'USD', category: 'tools', inStock: true, description: 'A widget', images: [] },
  { id: 'p2', name: 'Gadget', price: 49.99, currency: 'USD', category: 'tools', inStock: false, description: 'A gadget', images: [] },
  { id: 'p3', name: 'Gizmo', price: 19.99, currency: 'USD', category: 'tools', inStock: true, description: 'A gizmo', images: [] },
]

export default function Page() {
  return (
    <div>
      <h1>Products</h1>
      {products.map(p => (
        <Card key={p.id} title={p.name}>
          <Badge label={formatCurrency(p.price, p.currency)} />
          <Badge label={p.category} />
          {p.inStock ? <Button>Add to cart</Button> : <Badge label="Out of stock" />}
          <p>{p.description}</p>
        </Card>
      ))}
      <Table rows={products.map(p => [p.name, formatCurrency(p.price), p.category, p.inStock ? 'yes' : 'no'])} />
    </div>
  )
}