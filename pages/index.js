import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Home(props) {
  const router = useRouter()
  return (
    <div>
      <p id="gssp-locale">gssp locale: {props.locale}</p>
      <p id="gssp-default-locale">gssp defaultLocale: {props.defaultLocale}</p>
      <p id="meta-default-locale">meta defaultLocale: {props.metaDefaultLocale}</p>
      <p id="router-locale">router.locale: {router.locale}</p>
      <p id="router-default-locale">router.defaultLocale: {router.defaultLocale}</p>
      <div id="links">
        {['de', 'fr', 'fr-en', 'nl', 'nl-en', 'it'].map((l) => (
          <Link key={l} href="/" locale={l} id={`link-${l}`}>
            {l}
          </Link>
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps({ locale, defaultLocale, req }) {
  const meta = req[Symbol.for('NextInternalRequestMeta')] || {}
  return {
    props: {
      locale: locale ?? null,
      defaultLocale: defaultLocale ?? null,
      metaDefaultLocale: meta.defaultLocale ?? null,
    },
  }
}
