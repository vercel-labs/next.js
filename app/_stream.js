export const SRC = "https://picsum.photos/id/237/200/200.jpg"

export async function streamImage() {
  const r = await fetch(SRC, { cache: "no-store" })
  const reader = r.body.getReader()
  const stream = new ReadableStream({
    start(controller) {
      return pump()
      function pump() {
        return reader.read().then(({ done, value }) => {
          if (done) return controller.close()
          controller.enqueue(value)
          return pump()
        })
      }
    },
  })
  return new Response(stream, {
    status: 200,
    headers: {
      "content-type": r.headers.get("content-type") || "image/jpeg",
      "cache-control": "public, max-age=60",
    },
  })
}

export async function bufferImage() {
  const r = await fetch(SRC, { cache: "no-store" })
  const buf = await r.arrayBuffer()
  return new Response(buf, {
    status: 200,
    headers: {
      "content-type": r.headers.get("content-type") || "image/jpeg",
      "content-length": String(buf.byteLength),
      "cache-control": "public, max-age=60",
    },
  })
}

export function slowStream(contentType = "image/jpeg") {
  const enc = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const r = await fetch(SRC, { cache: "no-store" })
      const buf = new Uint8Array(await r.arrayBuffer())
      await new Promise((res) => setTimeout(res, 3000))
      for (let i = 0; i < buf.length; i += 1024) {
        controller.enqueue(buf.slice(i, i + 1024))
        await new Promise((res) => setTimeout(res, 20))
      }
      controller.close()
      void enc
    },
  })
  const headers = { "cache-control": "public, max-age=60" }
  if (contentType) headers["content-type"] = contentType
  return new Response(stream, { status: 200, headers })
}

export async function largeStream() {
  const r = await fetch("https://picsum.photos/id/237/4000/3000.jpg", { cache: "no-store" })
  return new Response(r.body, {
    status: 200,
    headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=60" },
  })
}

export async function copyHeaderStream() {
  const r = await fetch(SRC, { cache: "no-store" })
  const headers = new Headers(r.headers)
  headers.set("cache-control", "public, s-maxage=59, stale-while-revalidate")
  return new Response(r.body, { status: 200, headers })
}
