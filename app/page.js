import Link from 'next/link';

export default function Home() {
  return (
    <ul>
      <li><Link id="to-ok" href="/entity/ok">/entity/ok (exists)</Link></li>
      <li><Link id="to-missing" href="/entity/missing">/entity/missing (notFound)</Link></li>
      <li><Link id="to-boom" href="/boom">/boom (throws)</Link></li>
    </ul>
  );
}
