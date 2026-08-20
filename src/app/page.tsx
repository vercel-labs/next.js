import Link from "next/link";

export default function Home() {
  const buildLabel = process.env.NEXT_PUBLIC_REPRO_BUILD || "development";

  return (
    <main className="repro-page">
      <p className="repro-eyebrow">Static export version-skew reproduction</p>
      <h1>Home from build {buildLabel}</h1>
      <p>
        The link below explicitly includes a trailing slash. The mixed build
        serves this home page from build A and the target RSC payload from build
        B.
      </p>
      <Link className="repro-link" href="/target/" prefetch={false}>
        Open /target/ 1-1
      </Link>
    </main>
  );
}
