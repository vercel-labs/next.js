// Minimal stand-in for msw's setupWorker(): module-level side effects
// (event listener + keepalive interval) created when this module is evaluated.
let instances = 0;

export function setupWorker(handlers) {
  const id = `worker-${++instances}-${Math.random().toString(36).slice(2, 6)}`;
  let keepalive;

  const listener = (event) => {
    for (const handler of handlers) {
      if (handler.name === event.detail) {
        console.log('[mock] %s handled "%s" ->', id, event.detail, handler.resolve());
      }
    }
  };

  return {
    id,
    start() {
      console.log('[mock] start %s', id);
      window.addEventListener('mock-request', listener);
      // msw keeps a client<->worker channel alive with an interval:
      // https://github.com/mswjs/msw/blob/main/src/browser/setupWorker/start/createStartHandler.ts
      keepalive = setInterval(() => {}, 5000);
    },
    stop() {
      window.removeEventListener('mock-request', listener);
      clearInterval(keepalive);
    },
  };
}
