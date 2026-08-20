export const getStaticProps = async () => {
  console.log('REVALIDATING /')
  return { props: { now: Date.now() }, revalidate: 1 }
}

export default function Home({ now }) {
  return <p>ISR page {now}</p>
}
