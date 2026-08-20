import Link from 'next/link';
export default function Test() {
  return (
    <>
      <div style={{ height: 800 }}>spacer top (scroll down)</div>
      <h2 id="anchor">The anchor element (pages router)</h2>
      <div style={{ height: 3000 }}>spacer</div>
      <p><Link id="to-another" href="/another">Open another page</Link></p>
      <div style={{ height: 2000 }}>spacer bottom</div>
    </>
  );
}
