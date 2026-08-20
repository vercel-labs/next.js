import { cookies } from 'next/headers';

export default function Page() {
  const sessionId = cookies().get('sessionId')?.value ?? null;
  return <pre id="out">route=f sessionId={JSON.stringify(sessionId)}</pre>;
}
