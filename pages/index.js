import Link from "next/link";
export default function Home() {
  return (
    <div>
      <h1>home</h1>
      <Link href="/product/1234/?Page=2" id="l1234">to 1234</Link>
    </div>
  );
}
