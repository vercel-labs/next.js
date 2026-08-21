export function generateStaticParams() { return [{ slug: 'foo' }]; }
export default async function P({ params }) { const { slug } = await params; return <h1>hello {slug}</h1>; }
