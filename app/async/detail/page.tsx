export const dynamic = "force-dynamic";

import Link from "next/link";
import { Card } from "../../cross/card";

export default async function AsyncDetail() {
  await new Promise((r) => setTimeout(r, 300)); // e.g. a data fetch
  return (
    <div>
      <p>Detail (async server component). <Link href="/async">back</Link></p>
      <Card id="card" big={true} />
    </div>
  );
}
