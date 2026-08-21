import Link from "next/link";

const TOKEN = "a".repeat(7830);

export default function Home() {
  return (
    <main>
      <h1>Hello, Next.js!</h1>
      <Link href={`/dashboard?auth_token=${TOKEN}`}>Go to dashboard with long auth_token</Link>
    </main>
  );
}
