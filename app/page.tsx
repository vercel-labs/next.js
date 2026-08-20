import assert from "node:assert";
import { triggerRepro } from "./action";

export default async function Home() {
  // `.catch()` swallows the DynamicServerError thrown by `cookies()`,
  // so Next.js keeps prerendering this page statically.
  const user = await triggerRepro().catch(() => null);
  assert(user, "triggerRepro never returns null");
  return <main>{user}</main>;
}
