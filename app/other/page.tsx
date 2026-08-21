import Link from 'next/link';
import Card from '../card';

export default function Other() {
  return (
    <main>
      <h1>other (square should be RED)</h1>
      <Card />
      <Link id="to-home" href="/">home</Link>
    </main>
  );
}
