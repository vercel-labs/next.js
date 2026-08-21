import { useRef } from 'react';
import singletonRouter from 'next/router';
import { InstantSearch, Hits, Pagination, Configure } from 'react-instantsearch';
import { createInstantSearchRouterNext } from 'react-instantsearch-router-nextjs';
import singleIndex from 'instantsearch.js/es/lib/stateMappings/singleIndex';
import { searchClient } from './search-client';

const INDEX = 'products';

// keep `tab` in the URL while InstantSearch owns the rest of the query string
const createURL = ({ qsModule, routeState, location }) => {
  const tab = new URLSearchParams(location.search).get('tab');
  const qs = qsModule.stringify({ ...routeState, ...(tab ? { tab } : {}) });
  return `${location.protocol}//${location.host}${location.pathname}${
    qs ? `?${qs}` : ''
  }`;
};
const parseURL = ({ qsModule, location }) => {
  const { tab, ...rest } = qsModule.parse(location.search.slice(1));
  return rest;
};

export default function SearchTab({ tab, url }) {
  const routerRef = useRef(null);
  if (!routerRef.current) {
    routerRef.current = createInstantSearchRouterNext({
      singletonRouter,
      serverUrl: url,
      routerOptions: { cleanUrlOnDispose: false, createURL, parseURL },
    });
  }

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={INDEX}
      routing={{ router: routerRef.current, stateMapping: singleIndex(INDEX) }}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <Configure hitsPerPage={3} />
      <div data-testid={`panel-${tab}`}>
        <Hits hitComponent={({ hit }) => <div>{hit.name}</div>} />
        <Pagination />
      </div>
    </InstantSearch>
  );
}
