export default function Home() {
  return <p>hello {process.env.NODE_ENV} {process.env.MY_VAR}</p>
}
