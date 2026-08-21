export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <main>
      <style href="csp-style" precedence="bar">{`body { background: blue; }`}</style>
      <h1>csp nonce case</h1>
    </main>
  );
}
