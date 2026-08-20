import Loading from "@/features/shared/ui/icon/Loading";
import React, { Suspense } from "react";
import Example from "./Example";

export default function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-[1500px] sm:px-8 lg:px-24">
      <div className="mx-4 mb-8 mt-4">
        <h1 className="text-2xl font-bold text-[#323842]">Project Overview</h1>
      </div>
      <Suspense
        fallback={<Loading />}
      >
        <Example />
      </Suspense>
    </div>
  );
}
