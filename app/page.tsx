import Link from "next/link";
import { PushButton } from "./push-button";

export default function Home() {
  return (
    <main>
      <h1 id="home">Home</h1>
      <Link id="link-1" href="/photo/1">Open photo 1</Link>
      <Link id="link-command" href="/command">link command</Link>
      <PushButton />
    </main>
  );
}
