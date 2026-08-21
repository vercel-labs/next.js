import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>next#77828 — back navigation with router.push from setInterval</h1>
      <ol>
        <li>Type <code>/dog/1</code> in the address bar (no click inside the page).</li>
        <li>Wait while the page auto-pushes <code>/dog/2</code>, <code>/dog/3</code>, ... every 3s.</li>
        <li>Press the browser back button. Reported bug: it lands on the blank new-tab page.</li>
      </ol>
      <p>
        <Link href="/dog/1">Go to Dog 1 (Link, i.e. with user gesture)</Link>
      </p>
      <p>
        <a href="/plain.html">Control page: identical loop with raw history.pushState (no Next router)</a>
      </p>
    </main>
  );
}
