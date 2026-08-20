export const dynamicParams = false;
export function generateStaticParams({ params }) {
  console.log("[child gSP] received params: " + JSON.stringify(params));
  return [{ id: "a" }, { id: "b" }];
}
export default async function Page({ params }) {
  const p = await params;
  return <h1>child {p.slug}/{p.id}</h1>;
}
