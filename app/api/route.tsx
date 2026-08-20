import { renderToReadableStream } from "react-dom/server.browser";
import { WithState } from "../WithState";

export const dynamic = "force-dynamic";

export const GET = async () => {
  const html = await renderToReadableStream(<WithState />);
  return new Response(html, { headers: { "Content-Type": "text/html" } });
};
