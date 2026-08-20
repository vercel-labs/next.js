export default function Dyn({ locale, id }) {
  return <p id="locale">dynamic {id} locale: {locale}</p>
}
export function getServerSideProps({ locale, params }) {
  return { props: { locale, id: params.id } }
}
