import { CustomApiError, LOAD_INDEX } from './errors';

export function register() {
  globalThis.__instrumentationCtor = CustomApiError;
  globalThis.__instrumentationLoadIndex = LOAD_INDEX;
  console.log('[instrumentation] registered, errors.js load #' + LOAD_INDEX);
}
