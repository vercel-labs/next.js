import Link from "next/link";
export default function ProductsPage() {
  const ids = [1, 2, 3, 4, 5];
  return (
    <main>
      <h1>All products</h1>
      <ul>
        {ids.map((id) => (
          <li key={id}>
            <Link href={`/products/${id}`}>Product {id}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
