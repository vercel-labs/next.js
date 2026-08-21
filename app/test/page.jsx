export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
// Server Component that takes 1s, then redirects to /gleb
export default async function Test() {
  await new Promise((r) => setTimeout(r, 1000));
  redirect('/gleb');
}
