import Link from "next/link";

export default function Page() {
  return (
    <div>
      Welcome [locale] <Link id="deep" href="/test/does-not-exist">go to a 404 (client-side nav)</Link>
    </div>
  );
}
