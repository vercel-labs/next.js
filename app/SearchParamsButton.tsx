'use client';

import { useState } from 'react';
import { showSearchParams } from './actions';

export default function SearchParamsButton() {
  const [result, setResult] = useState<string>('');
  return (
    <div>
      <button
        id="run"
        onClick={async () => {
          const params = new URLSearchParams();
          params.set('foo', 'bar');
          params.set('next', 'js');
          // sanity check on the client
          console.log('client toString:', params.toString());
          const res = await showSearchParams(params);
          setResult(JSON.stringify(res, null, 2));
        }}
      >
        Call server action
      </button>
      <pre id="result">{result}</pre>
    </div>
  );
}
