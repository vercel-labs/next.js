export default function Hello({ locale }) {
  return <h1>Hello rendered with locale: {locale}</h1>;
}
export async function getServerSideProps({ locale }) {
  return { props: { locale } };
}
