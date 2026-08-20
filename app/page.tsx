import Nav from './nav';
export default function Page() {
  return (<main><h1 id="title">home</h1><Nav />{Array.from({length:200}).map((_,i)=><p key={i}>home line {i}</p>)}<Nav /></main>);
}
