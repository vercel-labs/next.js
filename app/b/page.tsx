import Nav from '../nav';
export default function B() {
  return (<main><h1 id="title">page b</h1><Nav />{Array.from({length:200}).map((_,i)=><p key={i}>b line {i}</p>)}<Nav /></main>);
}
