"use client";

import { useEffect, type PropsWithChildren } from "react";
import { getAuth } from "./actions";

// Client provider that fires a Server Action on mount. This leaves a router
// action pending while the route below is being rendered.
export function Providers({ children }: PropsWithChildren) {
  useEffect(() => {
    getAuth();
  }, []);

  return <div>{children}</div>;
}
