import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>next/link alias is ignored</h1>
      <Link href="/about" target="_blank">
        Go to about
      </Link>
    </div>
  );
}
