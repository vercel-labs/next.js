import Image from 'next/image';

export default function Page() {
  return (
    <main>
      <h1>next/image + svg</h1>
      {Array.from({ length: 12 }).map((_, i) => (
        <Image key={i} src="/logo.svg" alt="logo" width={394} height={80} priority={i === 0} />
      ))}
    </main>
  );
}
