import { getEvents, setEventName } from '../../../lib/store';
export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(getEvents());
}

// reset helper so each test starts from a known state
export async function POST() {
  setEventName('a', 'Event A');
  setEventName('b', 'Event B');
  return Response.json(getEvents());
}
