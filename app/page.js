import Image from 'next/image';

// Remote image whose own URL contains a query string, like the reported production case.
const src = 'https://placehold.co/600x400/png?text=hello&foo=bar';

export default function Home() {
  return (
    <>
      <h1>next/image priority preload encoding</h1>
      <Image src={src} alt="demo" width={600} height={400} priority />
    </>
  );
}
