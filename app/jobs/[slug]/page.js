import { Suspense } from 'react';
import { connection } from 'next/server';

async function Static() {
  'use cache';
  return <p>{'static '.repeat(70000)}</p>;
}
async function Dynamic() {
  await connection();
  return <p>dynamic {Date.now()}</p>;
}
export default function Page() {
  return (<main><Static /><Suspense fallback={<p>loading</p>}><Dynamic /></Suspense></main>);
}

export const instant = true;
