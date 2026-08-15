'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const coins = ['bitcoin', 'ethereum', 'solana'];

export default function CoinRows() {
  const router = useRouter();
  return (
    <ul>
      {coins.map((c) => (
        <li key={c}>
          <Link id={`link-${c}`} href={`/coin/${c}`}>{c} (link)</Link>{' '}
          <button id={`push-${c}`} onClick={() => router.push(`/coin/${c}`)}>{c} (push)</button>
        </li>
      ))}
    </ul>
  );
}
