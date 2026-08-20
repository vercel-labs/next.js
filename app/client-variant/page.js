import { ErrorBoundary } from '../components/error-boundary';
import BadClientComponent from './bad-client-component';

export default function Page() {
  return (
    <main>
      <h1 id="heading">Custom ErrorBoundary + throwing Client Component</h1>
      <ErrorBoundary>
        <BadClientComponent />
      </ErrorBoundary>
    </main>
  );
}
