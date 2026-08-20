export function generateStaticParams() { return ["a","b"].map(p=>({p})); }
export const dynamicParams = false;
export default async function WithStaticParam({ params }) {
  const { p } = await params;
  const time = await fetch("http://localhost:3999/", { cache: "force-cache", next: { tags: ["current-time"] } }).then(r=>r.json()).then(d=>d.unixtime);
  return `${p} ${time}`;
}
