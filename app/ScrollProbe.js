'use client';
import { useEffect, useState } from 'react';

export default function ScrollProbe() {
  const [y, setY] = useState(0);
  const [mode, setMode] = useState('?');
  useEffect(() => {
    setMode(String(history.scrollRestoration));
    const onScroll = () => setY(Math.round(window.scrollY));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div
      id="probe"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10,
        background: '#111', color: '#0f0', padding: '6px 10px',
        font: '14px/1.4 monospace',
      }}
    >
      scrollY=<span id="scrollY">{y}</span> | history.scrollRestoration={mode}
    </div>
  );
}
