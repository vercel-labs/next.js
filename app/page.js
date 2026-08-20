import Parent from './parent'

export default async function Main({ searchParams }) {
  const data = await searchParams;
  return (
    <Parent getStuff={() => <h2>huh {data.foo}</h2>}></Parent>
  );
}
