'use server';

import { bump } from '../lib/counter';

export async function track(label: string) {
  return bump(label);
}
