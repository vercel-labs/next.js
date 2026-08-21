'use server';

import { cookies } from 'next/headers';

export async function serverAction(name: string, setCookie: boolean) {
  const store = await cookies();
  if (setCookie) {
    store.set('visit', `${name}-${Date.now()}`);
  }
  return store.get('visit')?.value ?? 'none';
}
