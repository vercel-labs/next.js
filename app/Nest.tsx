"use client";

// A plain, fixed-depth client component tree. It only exists to consume a
// predictable amount of SSR (Fizz) stack, so that the *extra* stack that the
// cold-compile render of a deep route consumes becomes visible as an overflow
// on linux/x64 as well (macOS/arm64 overflows without it, see README).
const DEPTH = 200;

function Nest({ n }: { n: number }) {
  if (n <= 0) return <p>ok</p>;
  return (
    <div>
      <Nest n={n - 1} />
    </div>
  );
}

export default function NestRoot() {
  return <Nest n={DEPTH} />;
}
