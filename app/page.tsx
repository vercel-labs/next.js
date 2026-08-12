export default function Page() {
  return (
    <main>
      <section className="panel">
        <h1>Turbopack NUL env repro</h1>
        <p>
          This page is intentionally tiny. The repro path is the global CSS
          import plus an inherited Windows environment variable containing a NUL
          byte.
        </p>
      </section>
    </main>
  );
}
