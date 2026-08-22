import Link from "next/link";
export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Link id="open" href="/product/1">Open product 1</Link>
    </main>
  );
}
