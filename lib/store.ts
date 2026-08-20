// Simple in-memory "database" shared across requests in dev.
type Event = { slug: string; name: string };

const g = globalThis as unknown as { __events?: Event[] };
if (!g.__events) {
  g.__events = [
    { slug: 'a', name: 'Event A' },
    { slug: 'b', name: 'Event B' },
  ];
}

export function getEvents() {
  return g.__events!;
}

export function getEvent(slug: string) {
  return g.__events!.find((e) => e.slug === slug);
}

export function setEventName(slug: string, name: string) {
  const e = getEvent(slug);
  if (e) e.name = name;
}
