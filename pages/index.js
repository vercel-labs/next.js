export default function Home({ locale }) {
  return <p id="page">index locale={locale}</p>
}
export function getServerSideProps({ locale }) {
  return { props: { locale } }
}
