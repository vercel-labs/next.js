import { ErrorBoundary } from './components/error-boundary';
import BadComponent from './components/bad-server-component';

export default function Page() {
  return (
    <main>
      <h1 id="heading">Custom ErrorBoundary + throwing Server Component</h1>
      <ErrorBoundary>
        <BadComponent />
      </ErrorBoundary>
    </main>
  );
}
