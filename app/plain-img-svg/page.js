export default function Page() {
  return (
    <main>
      <h1>plain img + svg</h1>
      {Array.from({ length: 12 }).map((_, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src="/logo.svg" alt="logo" width={394} height={80} />
      ))}
    </main>
  );
}
