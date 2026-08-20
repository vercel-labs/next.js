import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1 id="home">home</h1>
      <Link id="no-prefetch" href="/en/publication/car/in/berlin" prefetch={false}>
        no prefetch
      </Link>
      <br />
      <Link id="with-prefetch" href="/en/publication/car/in/munich">
        with prefetch
      </Link>
    </div>
  );
}
