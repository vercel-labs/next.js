'use client';

import { useState, useEffect } from 'react';

export default function FormTest() {
  const [inputValue, setInputValue] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    console.log('Hydration complete!');
    setHydrated(true);
  }, []);

  return (
    <>
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f0f0' }}>
        <h2>Form Field Test</h2>
        <p>Try typing in the field below immediately after page load:</p>
        
        <div>
          <label htmlFor="app-test-input">
            Test Input:
          </label>
          <input
            autoFocus
            id="app-test-input"
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
    </>
  );
}
