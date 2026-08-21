'use client';

export default function Error({ error, reset }) {
  return (
    <div id="error-boundary">
      <h2>error.js boundary rendered</h2>
      <p id="error-message">{String(error?.message)}</p>
      <button onClick={reset}>reset</button>
    </div>
  );
}
