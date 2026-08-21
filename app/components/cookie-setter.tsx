'use client';

import { useEffect } from 'react';
import { serverAction } from '../actions';

// MODE=set -> action sets a cookie (bug repro)
// MODE=noset -> action runs but sets no cookie (control)
// MODE=none -> no action at all (control)
const MODE = process.env.NEXT_PUBLIC_ACTION_MODE ?? 'set';

export default function CookieSetter({ name }: { name: string }) {
  useEffect(() => {
    if (MODE === 'none') return;
    serverAction(name, MODE === 'set');
  }, [name]);
  return <div id="cookie-setter">mode: {MODE}</div>;
}
