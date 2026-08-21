import Link from "next/link";
import Counter from "./counter";
export default function Home() {
  return (<main><h1 id="title">Home</h1><Counter /><p><Link id="soft" href="/other">soft link to /other</Link></p><p><a id="hard" href="/other">hard link to /other</a></p></main>);
}
