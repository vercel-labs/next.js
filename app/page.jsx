'use client';

import { useState } from 'react';
import { echo } from './actions';

export default function Page() {
  const [value, setValue] = useState('');
  return (
    <main>
      <button id="run" onClick={async () => setValue(await echo())}>
        run action
      </button>
      <pre id="out">{value}</pre>
    </main>
  );
}
