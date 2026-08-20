import { cookies } from "next/headers";

export default async function TestPage() {
  const value = (await cookies()).get("someCookie")?.value;
  return <div>{value}</div>;
}
