const css = (
  <style href="foo" precedence="bar" nonce="12345">{`
    body { background: red; }
  `}</style>
);

export default function Page() {
  return (
    <main>
      {css}
      <link rel="stylesheet" href="/other.css" precedence="bar" nonce="12345" />
      <script async src="/noop.js" nonce="12345" />
      <h1>nonce repro</h1>
    </main>
  );
}
