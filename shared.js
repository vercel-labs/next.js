// Evaluated once per module instantiation. Side effect at import time:
const instanceId = Math.random().toString(36).slice(2, 10);
console.log('[shared.js] MODULE EVALUATED instanceId=' + instanceId);
globalThis.__sharedEvals = (globalThis.__sharedEvals || 0) + 1;
export function getInstanceId() {
  return instanceId;
}
export function getEvalCount() {
  return globalThis.__sharedEvals;
}
