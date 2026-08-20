export default function About({ locale }) {
  return <p id="page">about locale={locale}</p>
}
export function getServerSideProps({ locale }) {
  return { props: { locale } }
}
