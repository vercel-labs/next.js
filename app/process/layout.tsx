// app/process/layout.tsx
import Link from 'next/link';

export default function ProcessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar with Link to home - THIS LINK GETS PREFETCHED */}
      <nav style={{ width: '200px', padding: '20px', background: '#f0f0f0' }}>
        <Link href="/">
          Dashboard
        </Link>
      </nav>
      <main style={{ flex: 1, padding: '20px' }}>
        {children}
      </main>
    </div>
  );
}