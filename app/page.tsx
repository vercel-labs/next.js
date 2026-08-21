import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <nav>
        <Link id="brands" href="/c/brands">Brands</Link>{" "}
        <Link id="deals" href="/c/deals">Deals</Link>
      </nav>
    </main>
  );
}
