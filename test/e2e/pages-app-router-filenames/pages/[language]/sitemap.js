export function getServerSideProps({ params }) {
  return { props: { name: `${params.language}/sitemap` } }
}

export default function NestedSitemap({ name }) {
  return <p id="page">{name}</p>
}
