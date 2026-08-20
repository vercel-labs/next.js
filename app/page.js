import Link from 'next/link';

export default function Home() {
  return (
    <ul>
      <li><Link href="/next-image">/next-image</Link></li>
      <li><Link href="/plain-img">/plain-img</Link></li>
    </ul>
  );
}
