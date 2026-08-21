import Link from "next/link";
import Counter from "../counter";
export default function Other() {
  return (<main><h1 id="title">Other</h1><Counter /><p><Link id="soft" href="/">soft link to /</Link></p><p><a id="hard" href="/">hard link to /</a></p></main>);
}
