'use client';

export default function Page() {
  return (
    <main>
      <h1>HMR module persistence repro</h1>
      <button
        id="fetch-movies"
        onClick={() => {
          console.log('[app] click');
          window.dispatchEvent(new CustomEvent('mock-request', { detail: 'movies' }));
        }}
      >
        Fetch movies
      </button>
    </main>
  );
}
