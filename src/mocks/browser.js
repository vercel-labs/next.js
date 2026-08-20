import { setupWorker } from './worker';
import { handlers } from './handlers';

export const worker = setupWorker(handlers);
