'use client';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  return (
    <button id="back-button" onClick={() => router.back()}>
      router.back()
    </button>
  );
}
