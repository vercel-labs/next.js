import type { PropsWithChildren } from "react";

// Route group kept only so /dashboard (the redirect target) has a home.
export default function SignedInLayout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
