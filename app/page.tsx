import Link from 'next/link'
import { addItemAction } from './actions'
import { listItems } from './data'

export default function Home() {
  const items = listItems()
  console.log('[render] / (home)')
  return (
    <main>
      <h1>Items</h1>
      <form action={addItemAction}>
        <input name="name" defaultValue="my item" />
        <button type="submit" id="add">Add Item</button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Link href={`/items/${item.id}`} id={`link-${item.id}`}>
              {item.name} ({item.id})
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
