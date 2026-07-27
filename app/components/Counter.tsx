'use client';

import {useState} from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <section>
      <h2>Counter</h2>
      <button onClick={() => setCount((c) => c + 1)}>count: {count}</button>
    </section>
  );
}
