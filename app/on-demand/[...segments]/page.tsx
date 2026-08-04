import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

type PageProps = { params: Promise<{ segments: string[] }> };

export default async function OnDemandPage({ params }: PageProps) {
  const { segments } = await params;
  console.log("OnDemandPage:render", segments);
  if (segments[0] === "foo") {
    notFound();
  }
  return <main>ok: /{segments.join("/")}</main>;
}
