import Link from 'next/link';
export default async function Page() {
  await new Promise((r) => setTimeout(r, 1500));
  return (<div><p id="archived-content">archived revenue data</p>
    <Link id="back-to-dashboard" href="/dashboard">Back to Dashboard</Link></div>);
}
