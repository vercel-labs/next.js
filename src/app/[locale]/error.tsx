'use client';
export default function Error({ error, reset }: any) {
  return <div><p>Something went wrong!</p><button id="try-again" onClick={() => reset()}>Try again</button></div>;
}
