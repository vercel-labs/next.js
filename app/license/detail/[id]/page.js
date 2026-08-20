export default async function P({ params }) { const { id } = await params; return <h1>id: {id}</h1>; }
