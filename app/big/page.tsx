import Client from "./client";

// ~1.7 MB flight payload, used to test whether the render payload is retained.
export default function Page() {
  const data = Array.from({ length: 4000 }, (_, i) => `row-${i}-` + "x".repeat(200));
  return <Client data={data} />;
}
