'use server';

export async function echo() {
  // Non-ASCII payload to make the missing charset visible
  return 'héllo wörld — ünïcode ✅';
}
