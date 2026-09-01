import { greet } from './sibling.mjs';
self.postMessage(greet('worker'));
