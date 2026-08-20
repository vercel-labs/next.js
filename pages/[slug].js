export async function getServerSideProps(ctx) {
  return { props: { slug: String(ctx.params?.slug), locale: ctx.locale ?? null } }
}
export default function Slug({ slug, locale }) {
  return <p>slug={slug} locale={locale}</p>
}
