export default function Page() {
  return (
    <main>
      <h1>plain img</h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero.png" alt="hero" width={1200} height={800} />
    </main>
  );
}
