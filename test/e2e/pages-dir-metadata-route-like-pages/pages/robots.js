export async function getStaticProps() {
  return { props: { count: 3 } }
}

export default function Robots({ count }) {
  return <h1>Robots: {count}</h1>
}
