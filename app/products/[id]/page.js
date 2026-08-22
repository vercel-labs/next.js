import { Suspense } from "react";
import ProductDetail from "./product-detail";
import Loading from "@/app/loading";

export default async function Page({ params }) {
  const { id } = await params;
  const base = process.env.NEXT_PUBLIC_STORE_URL || `http://localhost:${process.env.PORT || 3000}/api/`;
  const res = await fetch(`${base}products/${id}`, { cache: "no-store" });
  if (!res.ok) { console.error("fetch failed", base, res.status); return <div>Product not found</div>; }
  const data = await res.json();
  return (
    <Suspense fallback={<Loading />}>
      <div>
        <ProductDetail data={data} />
      </div>
    </Suspense>
  );
}
