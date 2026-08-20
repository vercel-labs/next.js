import Image from 'next/image';

export default function Page() {
  return (
    <main>
      <h1>next/image</h1>
      <Image src="/hero.png" alt="hero" width={1200} height={800} priority />
    </main>
  );
}
