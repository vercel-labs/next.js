import { redirect } from 'next/navigation';

// Not statically prerenderable: forces the redirect to happen per request.
export const dynamic = 'force-dynamic';

export default async function Source() {
  redirect('/target');
}
