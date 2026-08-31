'use client';
import { useEffect, useState } from 'react';

// Lives in the LAYOUT, i.e. OUTSIDE the Suspense boundary (issue's "control").
export default function HydrationProbe() {
  const [state, setState] = useState({ hydratedAtMs: null as number | null, polls: 0 });
  useEffect(() => {
    const start = Date.now();
    const counters = { visibility: 0, focus: 0, pointer: 0 };
    const onVis = () => counters.visibility++;
    const onFocus = () => counters.focus++;
    const onPointer = () => counters.pointer++;
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', onFocus);
    window.addEventListener('pointerdown', onPointer, true);
    let polls = 0;
    const id = setInterval(() => {
      polls++;
      const el = document.querySelector('[data-probe="bit-1"]');
      const hydrated = !!el && Object.keys(el).some((k) => k.startsWith('__react'));
      setState((s) => ({
        polls,
        hydratedAtMs: s.hydratedAtMs ?? (hydrated ? Date.now() - start : null),
      }));
      (window as any).__probe = { ...counters, polls, hydrated };
      if (hydrated) clearInterval(id);
    }, 100);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('pointerdown', onPointer, true);
    };
  }, []);
  return (
    <pre data-probe="report">
      layout hydrated: yes | page hydratedAtMs: {String(state.hydratedAtMs)} | polls: {state.polls}
    </pre>
  );
}
