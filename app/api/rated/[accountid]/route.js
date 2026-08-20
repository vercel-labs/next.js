import { unstable_cache } from 'next/cache';

export const dynamic = 'force-dynamic';

// unstable_cache read from a dynamic route handler, like the reporter's
// /api/account/[sessionid]/rated/[accountid]/movies route.
const getRated = (accountid) =>
  unstable_cache(
    async () => {
      console.log('[MISS] api rated', accountid);
      return Date.now();
    },
    ['api-rated', accountid],
    { tags: [`rated:${accountid}`] }
  )();

export async function GET(_req, { params }) {
  const { accountid } = await params;
  return Response.json({ value: await getRated(accountid) });
}
