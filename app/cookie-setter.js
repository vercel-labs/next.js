'use client';
import { useEffect, useState } from 'react';
import { setCookieAction } from './actions';

export default function CookieSetter() {
  const [state, setState] = useState('pending');
  useEffect(() => {
    setCookieAction().then((r) => setState(r));
  }, []);
  return <p id="cookie-state">cookie action: {state}</p>;
}
