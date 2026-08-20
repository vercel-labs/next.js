'use client';
import { useState } from 'react';

export default function UniqueProfilerComponent() {
  const [n, setN] = useState(0);
  return (
    <div>
      <AnotherNamedChildComponent count={n} />
      <button id="inc" onClick={() => setN(n + 1)}>inc</button>
    </div>
  );
}

export function AnotherNamedChildComponent({ count }) {
  return <p id="out">count: {count}</p>;
}
