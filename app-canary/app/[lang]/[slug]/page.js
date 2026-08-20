export function generateStaticParams(){return [{slug:'a'},{slug:'b'}]}
export default async function P({params}){const p = await params; return <h1>{p.lang}/{p.slug}</h1>}
