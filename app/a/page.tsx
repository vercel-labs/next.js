import Nav from '../nav';
export default function A() {
  return (<main><h1 id="title">page a</h1><Nav />{Array.from({length:200}).map((_,i)=><p key={i}>a line {i}</p>)}<Nav /></main>);
}
