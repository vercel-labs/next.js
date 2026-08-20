import Nav from '../nav';
export default async function Q({ searchParams }: any) {
  const sp = await searchParams;
  return (<main><h1 id="title">q {sp?.n ?? '0'}</h1><Nav />{Array.from({length:200}).map((_,i)=><p key={i}>q line {i}</p>)}</main>);
}
