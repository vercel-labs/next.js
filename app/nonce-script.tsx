import { headers } from "next/headers";

const INLINE = `document.documentElement.dataset.dvh = window.innerHeight + "px";`;

export async function NonceScript() {
  const nonce = (await headers()).get("x-nonce") ?? "";
  return (
    <script
      id="blocking-polyfill"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: INLINE }}
    />
  );
}
