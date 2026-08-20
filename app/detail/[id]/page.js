import Link from 'next/link';
import ScrollProbe from '../../ScrollProbe';

export default async function Detail({ params }) {
  const { id } = await params;
  return (
    <main>
      <ScrollProbe />
      <h1 id="detail-title" style={{ paddingTop: 40 }}>Detail {id}</h1>
      <p>Now press the browser back button (on iOS Safari: swipe up quickly first).</p>
      <p><Link href="/">back via Link</Link></p>
      {Array.from({ length: 60 }, (_, i) => (
        <p key={i} style={{ padding: '12px 10px' }}>detail filler {i}</p>
      ))}
    </main>
  );
}
