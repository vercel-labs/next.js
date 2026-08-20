export const dynamic = 'force-dynamic';

export default async function Boom() {
  throw new Error('boom');
}
