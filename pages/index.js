export default function Home({ locale }) {
  return <p id="locale">locale: {locale}</p>
}
export function getServerSideProps({ locale }) {
  return { props: { locale } }
}
