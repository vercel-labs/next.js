// Number of pages that the catch-all route prerenders.
export const PAGE_COUNT = 200

// Number of paragraphs per page. Each paragraph is ~500 bytes, so every page
// renders ~200 KB of content, like a page of a documentation site.
export const PARAGRAPHS_PER_PAGE = 400

// A heap sample is logged after every n-th prerender.
export const SAMPLE_EVERY = 25
