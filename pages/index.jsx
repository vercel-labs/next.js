import React, { Suspense } from 'react';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const Footer = React.lazy(async () => {
  await sleep(5000);
  const { Footer } = await import('../components/footer');
  return { default: Footer };
});

export default function Home() {
  return (
    <main>
      <h1>Pages Router: selective hydration + CSS modules</h1>
      <Suspense fallback={<div id="fallback">Loading...</div>}>
        <Footer />
      </Suspense>
    </main>
  );
}
