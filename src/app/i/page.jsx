import { headers } from 'next/headers';
export const runtime = 'edge';
export default function Page() {
  const h = headers();
  const sessionId = h.get('x-session-id');
  return <pre id="out">route=i sessionId={JSON.stringify(sessionId)} ua={JSON.stringify(h.get('user-agent'))} ovr={JSON.stringify(h.get('x-middleware-override-headers'))}</pre>;
}
