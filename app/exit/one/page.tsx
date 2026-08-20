import Link from "next/link";
export default function One() {
  return <div id="page-one"><h2>Page one</h2><Link id="to-two" href="/exit/two">go to two</Link></div>;
}
