import { db } from './store'
import { updateInvoice } from './actions'

export default function Page() {
  return (
    <main style={{ fontFamily: 'monospace', padding: 24 }}>
      <p id="server-value">server customerId: {db.customerId}</p>
      <p id="server-name">server name: {db.name}</p>
      <form action={updateInvoice}>
        <select id="customerId" name="customerId" defaultValue={db.customerId}>
          <option value="a">Customer A</option>
          <option value="b">Customer B</option>
          <option value="c">Customer C</option>
        </select>
        <input id="name" name="name" type="text" defaultValue={db.name} />
        <button id="submit" type="submit">Edit Invoice</button>
      </form>
    </main>
  )
}
