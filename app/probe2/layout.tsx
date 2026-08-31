import { Suspense } from 'react';
import HydrationProbe from './HydrationProbe';

// Explicit <Suspense> in layout instead of loading.tsx (issue's second bisection row).
export default function Probe2Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <HydrationProbe />
      <Suspense fallback={<p data-probe="loading">…</p>}>{children}</Suspense>
    </section>
  );
}
