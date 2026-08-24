"use client";

import { getAuth } from "@/app/actions";
import { useEffect, type PropsWithChildren } from "react";

const Providers = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    getAuth();
  }, []);
  
  return (
    <div>{children}</div>
  );
};

export { Providers };
