import Link from 'next/link';
import { getEvents } from '../../lib/store';

export const dynamic = 'force-dynamic';

export default function EventsPage() {
  const events = getEvents();
  return (
    <main>
      <h1>Events</h1>
      <table>
        <tbody>
          {events.map((e) => (
            <tr key={e.slug}>
              <td data-testid={`name-${e.slug}`}>{e.name}</td>
              <td>
                <Link href={`/events/${e.slug}`} data-testid={`edit-${e.slug}`}>
                  edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
