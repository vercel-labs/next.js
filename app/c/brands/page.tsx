import { connection } from "next/server";

async function SlowBrands() {
  await connection();
  await new Promise((r) => setTimeout(r, 5000));
  return <ul id="brands-list"><li>Brand A</li><li>Brand B</li></ul>;
}

export default function BrandsPage() {
  return (
    <main>
      <h1 id="brands-title">Brands</h1>
      <SlowBrands />
    </main>
  );
}
