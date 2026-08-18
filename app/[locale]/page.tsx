type Locale = "en" | "de";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <p>locale: {locale}</p>;
}
