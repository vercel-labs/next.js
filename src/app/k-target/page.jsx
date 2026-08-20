import { headers } from 'next/headers';
export default function Page() {
  return <pre id="out">route=k sessionId={JSON.stringify(headers().get('x-session-id'))}</pre>;
}
