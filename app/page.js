import Image from 'next/image';

const assetPrefix = 'https://cdn.example.com';

export default function Page() {
  return (
    <main>
      <h1>next/image + assetPrefix</h1>
      <Image
        id="cdn-image"
        src={`${assetPrefix}/images/cat.jpg`}
        alt="Cat"
        width={30}
        height={30}
      />
    </main>
  );
}
