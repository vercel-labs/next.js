import Link from "next/link";

// Still broken on next canary (16.2.1-canary.26): clicking this Link issues TWO
// requests to the Route Handler, one with ?_rsc= and one plain navigation.
export default function From() {
  return (
    <Link href="/api/redirect" prefetch={false}>
      go to route handler
    </Link>
  );
}
