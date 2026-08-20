import Link from 'next/link';
import ScrollProbe from './ScrollProbe';

export default function Home() {
  return (
    <main>
      <ScrollProbe />
      <h1 style={{ paddingTop: 40 }}>Home (list page)</h1>
      <p>Scroll far down, tap a link, then swipe up quickly and hit the browser back button.</p>
      {Array.from({ length: 200 }, (_, i) => (
        <p key={i} style={{ padding: '12px 10px', borderBottom: '1px solid #eee' }}>
          row {i} — <Link id={`link-${i}`} href={`/detail/${i}`}>go to detail {i}</Link>
        </p>
      ))}
    </main>
  );
}
