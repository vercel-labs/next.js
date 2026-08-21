export class CustomApiError extends Error {
  constructor(status) { super('API Error: ' + status); this.name = 'CustomApiError'; this.status = status; }
}
// module-identity marker
globalThis.__moduleLoads = (globalThis.__moduleLoads || 0) + 1;
export const LOAD_INDEX = globalThis.__moduleLoads;
console.log('[errors.js] evaluated, load #' + LOAD_INDEX);
