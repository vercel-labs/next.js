import { Suspense } from "react";

import SuspenseCookies from "./suspenseCookies";

export default function PrivatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuspenseCookies />
    </Suspense>
  );
}
