'use client';
import { useRouter } from 'next/navigation';
export default function RefreshButton() {
  const router = useRouter();
  return <button id="btn" onClick={() => router.refresh()}>Refresh Data</button>;
}
