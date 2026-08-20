import Link from "next/link";
export default function Home() {
  return (<div>
    <h1 id="home">home</h1>
    <Link href="/post/1" id="to-post">to /post/1 (nested dynamic)</Link>
    <br/>
    <Link href="/flat" id="to-flat">to /flat (top level)</Link>
    <br/>
    <Link href="/awaited/1" id="to-awaited">to /awaited/1 (await outside boundary, nested)</Link>
    <br/>
    <Link href="/awaited-flat" id="to-awaited-flat">to /awaited-flat (await outside boundary, top level)</Link>
  </div>);
}
