import { headers } from 'next/headers';
import Link from 'next/link';

// Page is always dynamically rendered
export const revalidate = 0;

export default async function APage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Page A</h1>
      <Link
        href="/b"
        style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '12px 24px',
          backgroundColor: '#0070f3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
        }}
      >
        Go to Page B
      </Link>
    </div>
  );
}
