const info = require('../lib/info.cjs');

export async function getServerSideProps() {
  const data = info();
  console.log('[getServerSideProps]', JSON.stringify(data));
  return { props: { data } };
}

export default function Gssp({ data }: any) {
  return <pre id="out">{JSON.stringify(data, null, 2)}</pre>;
}
