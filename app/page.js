import { CustomApiError, LOAD_INDEX } from '../errors';

export const dynamic = 'force-dynamic';

export default function Page() {
  const err = new CustomApiError(403);
  const instrCtor = globalThis.__instrumentationCtor;
  const lines = [
    'page errors.js load index: ' + LOAD_INDEX,
    'instrumentation errors.js load index: ' + globalThis.__instrumentationLoadIndex,
    'err instanceof (page CustomApiError): ' + (err instanceof CustomApiError),
    'err instanceof (instrumentation CustomApiError): ' + (instrCtor ? err instanceof instrCtor : 'n/a'),
    'same class reference: ' + (CustomApiError === instrCtor),
  ];
  lines.forEach(l => console.log('[page] ' + l));
  return <pre>{lines.join('\n')}</pre>;
}
