import Nav from '../../nav';
export const dynamic = 'force-dynamic';
export default async function P({ params }: any) {
  const { id } = await params;
  return (<main><h1 id="title">page {id}</h1><Nav />{Array.from({length:200}).map((_,i)=><p key={i}>p line {i}</p>)}</main>);
}
