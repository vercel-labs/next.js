export const getStaticPaths = async () => ({ paths: [], fallback: 'blocking' })
export const getStaticProps = async ({ params }) => {
  console.log('GSP blocking for', params.slug)
  return { props: { slug: params.slug, now: Date.now() }, revalidate: 1 }
}
export default function B({ slug, now }) { return <p>{slug} {now}</p> }
