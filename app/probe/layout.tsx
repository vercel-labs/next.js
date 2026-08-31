import HydrationProbe from './HydrationProbe';

export default function ProbeLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <HydrationProbe />
      {children}
    </section>
  );
}
