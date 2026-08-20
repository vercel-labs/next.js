import Link from "next/link";

// For reproduction during `npm run build; npm run start`
export const dynamic = "force-dynamic";

function ProductCategories() {
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
      <ProductCategories />
    </div>
  );
}
