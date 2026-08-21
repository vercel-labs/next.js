export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  return <p>localized gsp id page: {locale} / {id}</p>;
}
