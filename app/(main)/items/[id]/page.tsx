import { notFound } from "next/navigation";

// Variant that matches the wording of issue #97354 (dynamic route calling
// notFound()). On its own this route does NOT crash: /items/missing renders the
// boundary below. Kept for reference — see README.
export const dynamic = "force-dynamic";

export default async function Item({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (id === "missing") notFound();
  return <main>Item {id}</main>;
}
