import { Diag } from 'external-image-pkg/diag'
export default function DiagPage() {
  return <Diag />
}
export async function getServerSideProps() {
  return { props: {} }
}
