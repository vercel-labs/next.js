
import Link from "next/link";
import { headers } from "next/headers";

export default async function Page() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const headersList = await headers();
  return (
    <div>
      <Link href={`link1`} prefetch={false}>Link 1</Link>
      <h1>Page 2</h1>
    </div>
  );
}
