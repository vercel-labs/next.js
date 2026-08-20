// A typical server-side module that imports next/cache
import { revalidatePath } from 'next/cache';

export function submit() {
  revalidatePath('/');
  return 'ok';
}
