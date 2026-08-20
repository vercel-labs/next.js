import Link from "next/link";
import * as React from "react";

// For reproduction during `npm run build; npm run start`
export const dynamic = "force-dynamic";

async function AsyncProductCategories() {
  // Simulated delay (e.g. data loading)
  await new Promise((resolve) => setTimeout(resolve, 100));

  return (
    <>
      {Array.from({ length: 100 }).map((_, i) => (
        <div key={i}>
          <h2 id={`category-${i + 1}`}>Category {i + 1}</h2>
        </div>
      ))}
    </>
  );
}

export default function Page() {
  return (
    <div>
      <h1>Products page</h1>
      <div>
        <Link href="/">back to home page</Link>
      </div>
      <React.Suspense fallback={<div>Loading...</div>}>
        <AsyncProductCategories />
      </React.Suspense>
    </div>
  );
}
