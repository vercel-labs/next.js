import {Suspense, type ReactNode} from 'react';
import {Counter} from './components/Counter';
import {FilterForm} from './components/FilterForm';
import {ItemList} from './components/ItemList';
import {StatusPanel} from './components/StatusPanel';

// Render per request (streaming SSR), like a typical authenticated dashboard page.
export const dynamic = 'force-dynamic';

// Small server-side awaits so each Suspense boundary is actually streamed
// (dehydrated boundaries), like data-fetching sections of a dashboard.
async function Section({delay, children}: {delay: number; children: ReactNode}) {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return <>{children}</>;
}

const SECTIONS = [
  Counter,
  FilterForm,
  ItemList,
  StatusPanel,
  Counter,
  FilterForm,
  ItemList,
  StatusPanel,
  Counter,
  FilterForm,
  ItemList,
  StatusPanel,
];

export default function Page() {
  return (
    <main>
      <h1>Dashboard-like page: client components inside streamed Suspense boundaries</h1>
      {SECTIONS.map((Component, index) => (
        <Suspense key={index} fallback={<p>loading section {index}…</p>}>
          <Section delay={5 + index * 5}>
            <Component />
          </Section>
        </Suspense>
      ))}
    </main>
  );
}
