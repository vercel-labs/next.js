export async function getServerSideProps() {
  return { props: { title: 'Page With Rewrite' } }
}
export default function Page({ title }) {
  return <h1>{title}</h1>
}
