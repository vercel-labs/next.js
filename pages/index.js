export default function Home({ locale }) {
  return <h1>Home rendered with locale: {locale}</h1>;
}
export async function getServerSideProps({ locale }) {
  return { props: { locale } };
}
