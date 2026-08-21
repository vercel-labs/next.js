export default function Home({ time }) {
  return <div>Hello at {time}</div>
}
Home.getInitialProps = async () => ({ time: new Date().toISOString() })
