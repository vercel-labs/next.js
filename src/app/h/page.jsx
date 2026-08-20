import { headers } from 'next/headers';

export default function Page() {
  const sessionId = headers().get('sessionId');
  return <pre id="out">route=h sessionId={JSON.stringify(sessionId)}</pre>;
}
