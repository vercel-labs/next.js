import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';

interface Props {
  serverTime: string;
}

export default function Home({ serverTime }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    console.log('Hydration complete!');
    setHydrated(true);
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Pages Router - Hydration Glitch Test</h1>
      
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff3cd', border: '2px solid #ff9800' }}>
        <h2>Pages Router Version</h2>
        <p>This page uses the Pages Router with SSR.</p>
      </div>
      
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f0f0' }}>
        <h2>Form Field Test</h2>
        <p>Try typing in the field below immediately after page load:</p>
        
        <div>
          <label htmlFor="test-input">
            Test Input:
          </label>
          <input
            autoFocus
            id="test-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Start typing..."
            style={{
              marginLeft: '1rem',
              padding: '0.5rem',
              fontSize: '1rem',
              width: '300px'
            }}
          />
        </div>
        
        <p style={{ marginTop: '1rem' }}>
          Current input value: <strong>{inputValue}</strong>
        </p>
        
        <p style={{ marginTop: '1rem' }}>
          Hydration status: <strong style={{ color: hydrated ? 'green' : 'red' }}>
            {hydrated ? 'Complete' : 'In Progress...'}
          </strong>
        </p>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff3cd' }}>
        <h3>Debug Info</h3>
        <p>Server rendered at: {serverTime}</p>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f0f0' }}>
        <h3>Compare with App Router</h3>
        <p>
          <a href="/app-router-test" style={{ color: '#1976d2', textDecoration: 'underline' }}>
            Go to App Router version
          </a>
        </p>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return {
    props: {
      serverTime: new Date().toISOString(),
    },
  };
};
