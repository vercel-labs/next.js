export const dynamicParams = false;
export function generateStaticParams() {
  console.log("[parent gSP] returning slugs");
  return [{ slug: "1" }, { slug: "2" }];
}
export default async function Page({ params }) {
  const p = await params;
  return <h1>parent {p.slug}</h1>;
}
