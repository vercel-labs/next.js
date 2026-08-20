'use client';
import { useState } from 'react';
import { doAction } from './actions';
export default function Button() {
  const [result, setResult] = useState('none');
  return (
    <div>
      <button id="run" onClick={async () => {
        try {
          const r = await doAction();
          setResult('resolved: ' + JSON.stringify(r));
        } catch (e) {
          setResult('threw: ' + String(e));
        }
      }}>Run server action</button>
      <p id="result">{result}</p>
    </div>
  );
}
