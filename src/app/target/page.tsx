import Link from "next/link";

export default function TargetPage() {
  const buildLabel = process.env.NEXT_PUBLIC_REPRO_BUILD || "development";

  return (
    <main className="repro-page">
      <p className="repro-eyebrow">Navigation target</p>
      <h1>Target from build {buildLabel}</h1>
      <p>
        Check the address bar and Network panel. On an affected Next.js build,
        version skew triggers a document navigation to /target without the
        configured trailing slash.
      </p>
      <Link className="repro-link" href="/">
        Back home
      </Link>
    </main>
  );
}
