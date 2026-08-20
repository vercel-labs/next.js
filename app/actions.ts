'use server';

import { revalidatePath } from 'next/cache';
import { setEventName } from '../lib/store';

export async function saveEvent(slug: string, name: string) {
  setEventName(slug, name);
  console.log('[action] saved', slug, '->', name, '| revalidatePath("/events")');
  revalidatePath('/events');
}
