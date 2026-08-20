import Link from 'next/link';
export async function getStaticProps() { return { props: { items: [1, 2, 3] } }; }
export default function Ssg(props) {
  return (<div><h1 id="ssg">SSG page</h1><pre id="props">{JSON.stringify(props)}</pre>
    <Link id="to-home" href="/">Back home (auto-static)</Link></div>);
}
