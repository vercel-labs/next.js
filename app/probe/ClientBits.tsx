'use client';
import { useState } from 'react';
export default function ClientBits({ n }: { n: number }) {
  const [c, setC] = useState(0);
  return (
    <button data-probe={`bit-${n}`} onClick={() => setC((x) => x + 1)}>
      {n}: {c}
    </button>
  );
}
