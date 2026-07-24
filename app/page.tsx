import Link from "next/link";

// Home lives OUTSIDE the (dash) layout, so clicking through to /status is a real
// client-side navigation that mounts the sidebar (and its prefetch burst) fresh.
export default function Home() {
  return (
    <main style={{ padding: 32, maxWidth: 640 }}>
      <h1>Server Action abort repro</h1>
      <p>
        Click into the dashboard, then immediately press <strong>Mark ready</strong>. Behind an
        HTTP/1.1 latency proxy the sidebar prefetch burst occupies all of Chrome&apos;s six
        connections, so the Server Action&apos;s round trip is stalled and the UI stays frozen on
        <code> draft</code>. Run <code>npm run repro</code> to see it measured against an
        unsaturated (HTTP/2-equivalent) control.
      </p>
      <p>
        <Link href="/status" prefetch={false}>
          Enter dashboard →
        </Link>
      </p>
    </main>
  );
}
