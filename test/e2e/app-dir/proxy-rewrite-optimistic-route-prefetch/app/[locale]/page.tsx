import { LinkAccordion } from '../../components/link-accordion'

// The home route: `/[locale]/page`, whose page segment path is
// `/$d$locale/__PAGE__`.
export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  return (
    <main>
      <p id="home">{`home:${locale}:end`}</p>
      <nav>
        {/* Not rewritten by the proxy: the URL parts of `/en` line up with the
            filesystem route, so the client learns a route pattern from it. */}
        <div>
          <LinkAccordion href="/en">en</LinkAccordion>
        </div>
        {/* Rewritten by the proxy to `/de/alpha`, which resolves to the
            catch-all route — a different route shape than `/en`. */}
        <div>
          <LinkAccordion href="/alpha">alpha</LinkAccordion>
        </div>
      </nav>
    </main>
  )
}
