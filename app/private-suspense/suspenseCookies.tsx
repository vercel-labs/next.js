import { cookies } from "next/headers";

export default async function SuspenseCookies() {
  const allCookies = (await cookies()).getAll();
  return (
    <p>
      Hello, this is the private page with cookies within a suspense boundary.
      The second type of error should have been triggered now. (
      {allCookies.length} cookies)
    </p>
  );
}
