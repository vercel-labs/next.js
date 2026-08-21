import type { NextConfig } from 'next';

// Step 2 of the issue: the config graph statically imports a module that
// imports `next/headers` (here: ./client). Swap for './client/config-client'
// to get the "known good" variant that avoids the import.
import { client } from './client';

void client.fetch();

// Diagnostic: which physical copies of the work-unit AsyncLocalStorage
// singleton were instantiated while resolving next.config.ts?
const keys = Object.keys(require.cache).filter((k) => k.includes('work-unit-async-storage'));

// eslint-disable-next-line no-console
console.log('[CONFIG-PROBE] pid=' + process.pid + '\n' + keys.join('\n'));

const nextConfig: NextConfig = {};

export default nextConfig;
