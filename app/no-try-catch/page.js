export default async function Page() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon", { cache: "no-store" });
  const data = await res.json();
  return <main>{data.results.map((i) => <p key={i.name}>{i.name}</p>)}</main>;
}
