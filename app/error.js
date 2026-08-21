'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h1 id="error-boundary">Error boundary triggered</h1>
      <pre id="error-message">{String(error && error.message)}</pre>
      <button onClick={reset}>reset</button>
    </div>
  );
}
