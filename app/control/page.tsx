import Link from "aliased-link";

// Control: same alias target, arbitrary specifier -> the custom Link IS used.
export default function Control() {
  return (
    <div>
      <h1>control</h1>
      <Link href="/about" target="_blank">
        Go to about
      </Link>
    </div>
  );
}
