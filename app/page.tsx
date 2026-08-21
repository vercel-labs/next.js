import { ClientComp } from "./ClientComp";

/**
 * @marker
 */
export default function Page() {
  return (
    <main>
      <p id="server">server: {"COMMENT_PROBE"}</p>
      <ClientComp />
    </main>
  );
}
