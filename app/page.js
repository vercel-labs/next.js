import { ComponentA } from "./components";

export default function Home() {
  return (
    <main>
      <h1>barrel + client component tree shaking</h1>
      <ComponentA />
    </main>
  )
}
