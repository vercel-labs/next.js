import { getRoleName } from './data'
import { Buttons } from './buttons'

export default async function Page() {
  const data = await getRoleName(1)
  return (
    <main>
      <h1>use cache + revalidatePath</h1>
      <p id="produced-at">producedAt: {data.producedAt}</p>
      <Buttons />
    </main>
  )
}
