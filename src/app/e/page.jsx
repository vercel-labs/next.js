import { headers } from 'next/headers';

export default function Page() {
  const sessionId = headers().get('x-session-id');
  return <pre id="out">route=e sessionId={JSON.stringify(sessionId)}</pre>;
}
