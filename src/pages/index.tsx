import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        maxWidth: "72ch",
        margin: "0 auto",
        textWrap: "pretty",
        fontFamily: "sans-serif",
        lineHeight: "1.5",
      }}
    >
      <h1>Next.js Routing Precedence Bug Report</h1>

      <p>
        Routing conflict between URL rewrites and catch-all routes during
        client-side navigation.
      </p>

      <p style={{ marginBottom: "2rem" }}>
        <a
          href="https://github.com/klaasman/nextjs-rewrite-catchall-conflict"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0366d6" }}
        >
          View source code on GitHub →
        </a>
      </p>

      <p>Required conditions to reproduce:</p>

      <ul>
        <li>Presence of middleware.ts (even if empty)</li>
        <li>Catch-all route ([...segments].tsx) with fallback: false</li>
        <li>
          Request path (/200) not included in catch-all route&apos;s prebuilt
          segment pathnames
        </li>
        <li>
          Proxied endpoint returns 2xx status code (issue doesn&apos;t occur
          with non-2xx responses)
        </li>
      </ul>

      <h2 style={{ marginTop: "4rem" }}>Test Case #1: 200 Status Response</h2>

      <Link prefetch={false} href="/200">
        Test rewrite to httpstat.us/200
      </Link>

      <p>
        During client-side navigation, the catch-all route incorrectly takes
        precedence over the configured rewrite to httpstat.us when the proxied
        endpoint returns a 2xx response. Server-side navigation (hard refresh)
        works as expected.
      </p>

      <p>
        <em>
          Note: The Next.js router attempts to prefetch data from:
          <code>/_next/data/development/200.json?segments=200</code>. This
          request gets proxied to httpstat.us, which returns its original 200
          response (not JSON).
          <br />
          The router might interpret this successful response as confirmation
          that the page exists locally, leading to incorrect client-side
          navigation instead of following the rewrite rule..?
        </em>
      </p>

      <h2 style={{ marginTop: "4rem" }}>Test Case #2: 400 Status Response</h2>

      <Link prefetch={false} href="/400">
        Test rewrite to httpstat.us/400
      </Link>

      <p>
        Control case: Demonstrates that the rewrite works correctly with non-2xx
        responses. The issue only occurs when the proxied endpoint returns a
        successful (2xx) response.
      </p>

      <p>
        <em>
          Note: This will show a &quot;400 Bad Request&quot; response - this is
          expected and actually proves the rewrite is working correctly (the
          error comes from httpstat.us as intended).
        </em>
      </p>

      <div
        style={{
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeeba",
          padding: "1rem",
          borderRadius: "4px",
          marginTop: "1rem",
        }}
      >
        <strong>Update after Vercel deployment:</strong>
        <p style={{ margin: "0.5rem 0" }}>
          I discovered that this test case behaves differently on Vercel
          compared to local development. While it works as expected locally
          (following the rewrite rule), on Vercel it exhibits the same incorrect
          routing behavior as Test Case #1.
        </p>
      </div>
    </div>
  );
}
