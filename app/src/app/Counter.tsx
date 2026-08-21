'use client';
import { useState } from 'react';

export function Counter({ incrementAction }: { incrementAction: (n: number) => Promise<number> }) {
  const [count, setCount] = useState(0);
  return (
    <>
      <p>Count: {count}</p>
      <p><button onClick={async () => setCount(await incrementAction(count))}>Increment</button></p>
    </>
  );
}
