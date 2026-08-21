import Link from "next/link";
export default function Home() {
  return <div><h1 id="home">Home</h1><Link href="/signin" id="to-signin">Go to signin</Link></div>;
}
