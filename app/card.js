export async function Card({ filter }) {
  await new Promise((r) => setTimeout(r, 3000))
  return <div id="card">card data for {filter}</div>
}
