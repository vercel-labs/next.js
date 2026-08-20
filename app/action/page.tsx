import { revalidateBothPaths, revalidateBothTags } from './actions'

export default function Page() {
  return (
    <form>
      <button id="paths" formAction={revalidateBothPaths}>revalidate both paths</button>
      <button id="tags" formAction={revalidateBothTags}>revalidate both tags</button>
    </form>
  )
}
