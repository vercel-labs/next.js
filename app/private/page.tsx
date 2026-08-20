import { cookies } from "next/headers";

export default async function PrivatePage() {
  const allCookies = (await cookies()).getAll();

  return (
    <p>
      Hello, this is the private page. The error should have been triggered now.
      ({allCookies.length} cookies)
    </p>
  );
}
