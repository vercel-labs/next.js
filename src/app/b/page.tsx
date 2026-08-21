import { headers } from 'next/headers';
import TestButtons from './components/TestButtons';

interface BPageProps {
  searchParams: Promise<{ test?: string }>;
}

// Page is always dynamically rendered
export const revalidate = 0;

export default async function BPage({ searchParams }: BPageProps) {
  const params = await searchParams;
  const currentTest = params.test || null;
  const renderedAt = new Date().toISOString();
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Page B</h1>

      <div style={{ marginTop: '20px', marginBottom: '30px' }}>
        <p style={{ fontSize: '16px', color: '#666' }}>
          Current test value: <strong>{currentTest || 'None'}</strong>
        </p>
      </div>

      <p id="rendered-at">rendered at: {renderedAt}</p>
      <TestButtons currentTest={currentTest} />
    </div>
  );
}
