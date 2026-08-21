// Framework-free control: raw streamed HTML, no React/Next rendering involved.
export const dynamic = "force-dynamic"

export function GET() {
  const enc = new TextEncoder()
  const stream = new ReadableStream({
    async start(c) {
      c.enqueue(
        enc.encode(
          `<!DOCTYPE html><html><body><button id="toggle" onclick="document.body.insertAdjacentHTML('beforeend','<p id=popover>interactive</p>')">Open popover</button><div>Loading data in 8 seconds...</div>`,
        ),
      )
      await new Promise((r) => setTimeout(r, 8000))
      c.enqueue(enc.encode(`<div id="data">Data Fetched</div></body></html>`))
      c.close()
    },
  })
  return new Response(stream, { headers: { "content-type": "text/html; charset=utf-8" } })
}
