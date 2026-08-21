export const dynamic = "force-dynamic";

export default async function Page() {
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const enc = new TextEncoder();
  const body = new ReadableStream({
    async start(c) {
      for (let i = 1; i <= 3; i++) {
        console.log(`[CLIENT] enqueue ${i} at ${new Date().toISOString()}`);
        c.enqueue(enc.encode(`chunk ${i}\n`));
        await delay(1000);
      }
      c.close();
    },
  });
  const res = await fetch(
    `http://localhost:${process.env.PORT ?? 3000}/api/stream`,
    { method: "POST", body, cache: "no-store", duplex: "half" } as RequestInit
  );
  return <pre>{await res.text()}</pre>;
}
