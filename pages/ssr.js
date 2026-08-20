export async function getServerSideProps() { return { props: { test: [1, 2, 3] } }; }
export default function Ssr(props) {
  return (<div><h1 id="ssr">SSR page</h1><pre id="props">{JSON.stringify(props)}</pre></div>);
}
