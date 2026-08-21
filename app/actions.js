'use server';
import { cookies } from 'next/headers';

export async function setCookieAction() {
  const store = await cookies();
  store.set('repro-cookie', String(Date.now()));
  return 'ok';
}
