import Image from 'next/image';

const URL = 'https://picsum.photos/id/870/200/300?grayscale=1&blur=2';

export default function Page() {
  return (
    <main>
      <h1>issue 84402</h1>
      <Image src={URL} alt="next/image unoptimized" width={200} height={300} unoptimized priority />
      <div>
        <img src={URL} alt="plain img" width={200} height={300} />
      </div>
      <noscript>
        <img src={URL} alt="noscript img" width={200} height={300} />
      </noscript>
      <a href={URL}>anchor</a>
    </main>
  );
}
