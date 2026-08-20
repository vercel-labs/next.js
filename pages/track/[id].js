export async function getServerSideProps({ params }) {
  return { props: { data: 'track' + params.id } }
}
export default function Track({ data }) {
  return <div>data: {data}</div>
}
