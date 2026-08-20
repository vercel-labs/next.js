import Link from "next/link";
export default function Page() {
  return (<div><div id="icon" className="svg-inline--fa">icon</div><div id="box" className="box">box</div><Link id="to-other" href="/other">other</Link></div>);
}
