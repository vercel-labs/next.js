export function generateStaticParams() {
  return [
    { type: "note", slug: "ascii-slug" },
    { type: "note", slug: "cli-환경에서-여러-명령어를-동시에-실행하기" },
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;
  return (
    <main>
      <h1 id="slug">{slug}</h1>
      <p id="type">{type}</p>
    </main>
  );
}
