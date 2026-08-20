import { ClientComponent } from '../components/ClientComponent'
import { ClientComponent2 } from '../components/ClientComponent2'

export default function Home() {
  return (
    <main>
      <ClientComponent />
      {/* Comment out ClientComponent2 and rebuild: the unused icons disappear. */}
      <ClientComponent2 />
    </main>
  )
}
