const info = require('../lib/info.cjs');

export default function Page() {
  const data = info();
  console.log('[server component]', JSON.stringify(data));
  return <pre id="out">{JSON.stringify(data, null, 2)}</pre>;
}
