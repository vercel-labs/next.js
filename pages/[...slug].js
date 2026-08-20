export async function getStaticProps(ctx) {
  return { props: { slug: ctx.params?.slug ?? null, someVariable: 'someValue' }, revalidate: 300 }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export default function Catchall(props) {
  return (
    <main>
      <h1>Catch-all page</h1>
      <h2 id="result">{props.slug ? props.slug.join('/') : 'NO PROPS'}</h2>
      <pre id="props">{JSON.stringify(props)}</pre>
    </main>
  )
}
