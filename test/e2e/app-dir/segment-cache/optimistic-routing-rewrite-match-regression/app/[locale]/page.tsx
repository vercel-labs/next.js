import { LinkAccordion } from '../../components/link-accordion'

export default function LocaleHome() {
  return (
    <main>
      <h1 id="home-page">HOME</h1>
      <ul>
        {/* Prefetching this link teaches the router the /[locale]
            pattern for one-part URLs. */}
        <li>
          <LinkAccordion href="/de">German home</LinkAccordion>
        </li>
        {/* Click target. /team is a one-part URL too, but it only
            resolves through /[locale]/team because of a rewrite, so the
            learned /[locale] pattern must not be applied to it. */}
        <li>
          <LinkAccordion href="/team" prefetch={false}>
            Team
          </LinkAccordion>
        </li>
      </ul>
    </main>
  )
}
