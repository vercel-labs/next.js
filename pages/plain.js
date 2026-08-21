// Control: same scenario WITHOUT next/router integration (plain InstantSearch
// history router). Used to show the behaviour is not Next.js specific.
import { InstantSearch, Hits, Pagination, Configure } from 'react-instantsearch';
import historyRouter from 'instantsearch.js/es/lib/routers/history';
import singleIndex from 'instantsearch.js/es/lib/stateMappings/singleIndex';
import { searchClient } from '../components/search-client';

const INDEX = 'products';
const router = typeof window === 'undefined' ? undefined : historyRouter({ cleanUrlOnDispose: false });

export default function Plain() {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={INDEX}
      routing={router ? { router, stateMapping: singleIndex(INDEX) } : false}
    >
      <Configure hitsPerPage={3} />
      <Hits hitComponent={({ hit }) => <div>{hit.name}</div>} />
      <Pagination />
    </InstantSearch>
  );
}
