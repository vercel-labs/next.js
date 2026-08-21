// Fake search client so the reproduction needs no network access / credentials.
export const searchClient = {
  search: (requests) =>
    Promise.resolve({
      results: requests.map((request) => {
        const page = request.params.page || 0;
        return {
          hits: Array.from({ length: 3 }, (_, i) => ({
            objectID: `${page}-${i}`,
            name: `item page ${page + 1} #${i}`,
          })),
          nbHits: 30,
          page,
          nbPages: 10,
          hitsPerPage: 3,
          processingTimeMS: 1,
          query: request.params.query || '',
          params: '',
          exhaustiveNbHits: true,
        };
      }),
    }),
  addAlgoliaAgent() {},
  clearCache: () => Promise.resolve(),
};
