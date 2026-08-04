import { getItems } from './data'
import { addAction } from './actions'

export default async function Page() {
  const items = await getItems()

  return (
    <main>
      <ul id="items">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <form action={addAction}>
        <input type="hidden" name="value" value="new" />
        <button id="add" type="submit">
          add
        </button>
      </form>
    </main>
  )
}
