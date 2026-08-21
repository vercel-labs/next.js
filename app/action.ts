"use server";

export async function startStream() {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Update the URL to our new route
  const url = `http://localhost:${process.env.PORT ?? 3000}/api/stream`;
  console.log(`[CLIENT] Starting POST to ${url}`);

  const webApiStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      console.log("[CLIENT] Enqueuing chunk 1");
      controller.enqueue(encoder.encode("This is chunk one.\n"));
      await delay(1000);
      console.log("[CLIENT] Enqueuing chunk 2");
      controller.enqueue(encoder.encode("This is the second chunk.\n"));
      await delay(1000);
      console.log("[CLIENT] Enqueuing chunk 3");
      controller.enqueue(encoder.encode("This is the final chunk.\n"));
      console.log("[CLIENT] Closing the stream.");
      controller.close();
    },
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/octet-stream" },
      body: webApiStream,
      // @ts-ignore
      duplex: "half",
    });
    console.log(`[CLIENT] Server responded with status: ${response.status}`);
    const result = await response.json();
    console.log("[CLIENT] Server response body:", result);
  } catch (error) {
    console.error("[CLIENT] Fetch failed:", error);
  }
}

export async function startStreamNoStore() {
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const enc = new TextEncoder();
  const body = new ReadableStream({
    async start(c) {
      for (let i = 1; i <= 3; i++) {
        console.log(`[CLIENT nostore] enqueue ${i}`);
        c.enqueue(enc.encode(`nostore chunk ${i}\n`));
        await delay(1000);
      }
      c.close();
    },
  });
  const res = await fetch(`http://localhost:${process.env.PORT ?? 3000}/api/stream`, {
    method: "POST",
    body,
    cache: "no-store",
    // @ts-ignore
    duplex: "half",
  });
  console.log("[CLIENT nostore] status", res.status, await res.text());
}
