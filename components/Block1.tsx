'use client';
import { useState } from 'react';
export default function Block1() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n+1)}>{n}</button>;
}
