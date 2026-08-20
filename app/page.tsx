'use client';
import { useEffect, useState } from 'react';
import { getPost } from './actions/actions';

export default function Page() {
  const [result, setResult] = useState('pending');
  useEffect(() => {
    (async () => {
      try {
        await getPost();
        setResult('no error thrown');
      } catch (error: any) {
        console.error('caught', error);
        setResult(
          JSON.stringify({
            name: error?.name,
            message: error?.message,
            digest: error?.digest,
            causeType: typeof error?.cause,
            cause: error?.cause ?? null,
            causeStatus: error?.cause?.status ?? null,
            causeCode: error?.cause?.code ?? null,
          })
        );
      }
    })();
  }, []);
  return <pre id="result">{result}</pre>;
}
