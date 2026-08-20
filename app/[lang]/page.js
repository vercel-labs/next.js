export default async function Page({ params }) {
  const { lang } = await params;
  return <h1 id="home">Home ({lang})</h1>;
}
