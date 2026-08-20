'use client';
import {useRouter} from 'next/navigation';
import {useState} from 'react';

export default function Home() {
  const router = useRouter();
  const [alternate, setAlternate] = useState(false);
  const pages = ['/', '/test'];

  return (
    <button
      onClick={() => {
        setAlternate(!alternate);
        router.push(`?page=${pages[alternate ? 0 : 1]}`);
      }}
    >
      Click me
    </button>
  );
}
