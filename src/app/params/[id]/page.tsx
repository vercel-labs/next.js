import { notFound } from "next/navigation";

export const dynamic = "force-static";

function isAllNumbers(str: string): boolean {
  return /^\d+$/.test(str);
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isAllNumbers(id)) {
    notFound();
  }
  return <div>{`Params : ${id} - Generated at ${new Date()}`}</div>;
}
