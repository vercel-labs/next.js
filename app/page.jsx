import ClientBox from './ClientBox'
import Inspector from './Inspector'

export default function Page() {
  return (
    <main>
      <div id="server-el">server component element</div>
      <ClientBox />
      <Inspector />
    </main>
  )
}
