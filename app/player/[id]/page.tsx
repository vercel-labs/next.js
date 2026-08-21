import { notFound } from "next/navigation";

export const revalidate = 1;
export const dynamic = "force-static";

export default async function Page() {
  notFound();
  return null;
}
