'use client';

import { Manager } from '@test/cjs-module';
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(() => {
    Manager.init();
    return 0;
  });
  return <button onClick={() => setCount(count + 1)}>clicked {count}</button>;
}
