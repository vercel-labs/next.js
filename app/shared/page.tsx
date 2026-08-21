import { getRoleName } from '../data'

export default async function Shared() {
  const data = await getRoleName(1)
  return <p id="produced-at">producedAt: {data.producedAt}</p>
}
