'use client';

import { use } from 'react';

const mockingEnabledPromise =
  typeof window !== 'undefined'
    ? import('../src/mocks/browser').then(({ worker }) => worker.start())
    : Promise.resolve();

export function MockProvider({ children }) {
  use(mockingEnabledPromise);
  return children;
}
