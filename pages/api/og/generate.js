export const config = { runtime: "edge" };
export default function handler() {
  return new Response("hello from edge", { headers: { "content-type": "text/plain" } });
}
