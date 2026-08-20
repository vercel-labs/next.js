'use client';

export default function Error({ error, reset }) {
  const received = {
    name: error.name,
    message: error.message,
    statusCode: error.statusCode ?? null,
    code: error.code ?? null,
    digest: error.digest ?? null,
    ownKeys: Object.keys(error),
  };
  if (typeof window !== 'undefined') {
    console.log('[client error.js] received error:', received);
  }
  return (
    <div>
      <h1>error.js boundary</h1>
      <pre id="received">{JSON.stringify(received, null, 2)}</pre>
      <button onClick={() => reset()}>reset</button>
    </div>
  );
}
