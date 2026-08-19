import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const instant = false;

export default async function Gated() {
  await cookies();
  await new Promise((resolve) => setTimeout(resolve, 300));
  redirect('/destination');
}
