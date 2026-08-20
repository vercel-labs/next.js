export function generateStaticParams() { return [{ slug: 'a' }, { slug: 'b' }] }
export default function Page({ params }) { return <h1>{JSON.stringify(params)}</h1> }
