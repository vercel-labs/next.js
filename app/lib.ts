export async function fetchTime() {
  const res = await fetch(
    "https://timeapi.fredkiss3.workers.dev/?timezone=Europe/Paris",
    { cache: "force-cache", next: { revalidate: 3600, tags: ["DATE_API_RESULT"] } }
  );
  return (await res.json()) as { timestamp: string };
}
