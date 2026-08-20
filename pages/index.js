export default function Home({ time }) {
  return <p id="time">{time}</p>
}

export async function getStaticProps() {
  console.log('[getStaticProps] / running')
  return { props: { time: new Date().toISOString() }, revalidate: 60 }
}
