export const dynamic = "force-dynamic";

// Stands in for the separate app hosted inside the iframe in the original
// report (a Vite dev server on another port). `?delay=` controls how long the
// iframe document takes to respond.
export async function GET(request: Request) {
  const delay = Number(new URL(request.url).searchParams.get("delay") ?? "0");
  await new Promise((resolve) => setTimeout(resolve, delay));
  return new Response(
    "<!doctype html><html><body><p>remote iframe content</p></body></html>",
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );
}
