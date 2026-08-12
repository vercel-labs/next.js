export async function getStaticProps() {
  return { props: { count: 2 } }
}

export default function Sitemap({ count }) {
  return <h1>Sitemap: {count}</h1>
}
