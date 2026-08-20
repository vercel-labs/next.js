export default async function Page() {
  const d = await (await fetch('http://127.0.0.1:3999/build-time')).json();
  return <p id="data">{`static-a -> hits=${d.hits} time=${d.time}`}</p>;
}
