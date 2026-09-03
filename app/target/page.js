'use client';
import { useEffect, useState } from 'react';

export default function Target() {
  const [state, setState] = useState('NOT hydrated (React never mounted)');
  useEffect(() => setState('hydrated'), []);
  return <h1>{state}</h1>;
}
