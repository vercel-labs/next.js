import { ClientComponent } from "@/app/client.page";
import { Suspense } from "react";

// force-dynamic so the streaming path is also exercised by `next build && next start`
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServerComponent />
    </Suspense>
  );
}

const ServerComponent = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return (
    <div>
      Server Component
      <ClientComponent />
    </div>
  );
};
