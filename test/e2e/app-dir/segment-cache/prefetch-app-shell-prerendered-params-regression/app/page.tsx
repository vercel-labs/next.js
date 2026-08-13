import { LinkAccordion } from '../components/link-accordion'

export default function Page() {
  return (
    <main>
      <h1 id="home">Home</h1>
      <ul>
        <li>
          <LinkAccordion href="/items/alpha">Item alpha</LinkAccordion>
        </li>
        <li>
          <LinkAccordion href="/static-page">Static page</LinkAccordion>
        </li>
      </ul>
    </main>
  )
}
