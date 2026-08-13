'use client';
import { useState, useEffect } from 'react';
export default function Form({ action, rows, jsonLd, promise }) {
  const [n, setN] = useState(0);
  useEffect(() => { setN(1); }, []);
  return (
    <form action={action}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <button>{n}</button>
      <ul>{rows.slice(0, 20).map((r) => <li key={r.id}>{r.name}</li>)}</ul>
    </form>
  );
}
