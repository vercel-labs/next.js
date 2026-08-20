'use client';

export const metadata = { title: 'Error' };

export default function Error({ error }) {
  return <div id="error">Error boundary: {String(error?.message ?? '')}</div>;
}
