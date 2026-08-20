import Link from "next/link";
export default function Home() {
  return (
    <main>
      <h1>home</h1>
      <Link id="dot" href="/url.">to /url. (redirect source with trailing dot)</Link>
      <br />
      <Link id="plain" href="/other">to /other (plain redirect source)</Link>
      <br />
      <Link id="dotseg" href="/hello/./world">to /hello/./world</Link>
    </main>
  );
}
