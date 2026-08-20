import { useEffect, useState } from 'react';

export default function Home() {
  const [out, setOut] = useState('loading...');
  useEffect(() => {
    fetch('/api/todos/1')
      .then(async (r) => setOut(`status=${r.status} body=${(await r.text()).slice(0, 200)}`))
      .catch((e) => setOut(`client error: ${e}`));
  }, []);
  return <pre id="out">{out}</pre>;
}
