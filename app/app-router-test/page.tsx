import FormTest from './FormTest';

export default function AppRouterPage() {
  const serverTime = new Date().toISOString();

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>App Router - Hydration Glitch Test</h1>
      
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#e3f2fd', border: '2px solid #1976d2' }}>
        <h2>App Router Version</h2>
        <p>This page uses the App Router to test if the same bug occurs.</p>
      </div>

      <FormTest />

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff3cd' }}>
        <h3>Debug Info</h3>
        <p>Server rendered at: {serverTime}</p>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#d1ecf1' }}>
        <h3>Testing Instructions</h3>
        <ol>
          <li>Ensure you're running the production build (<code>npm run build && npm start</code>)</li>
          <li>Enable network throttling (3G or Fast 3G) in DevTools</li>
          <li>Refresh the page</li>
          <li>Immediately start typing in the input field</li>
          <li>Watch if your input gets cleared when hydration completes</li>
        </ol>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f0f0' }}>
        <h3>Compare with Pages Router</h3>
        <p>
          <a href="/" style={{ color: '#1976d2', textDecoration: 'underline' }}>
            Go to Pages Router version
          </a>
        </p>
      </div>
    </div>
  );
}
