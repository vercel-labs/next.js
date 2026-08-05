import { Poller } from "../../../components/poller";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const dynamicParams = true;

export function generateStaticParams() {
  return [
    { scope: "site-a", locale: "en" },
    { scope: "site-a", locale: "zh" },
    { scope: "site-b", locale: "en" },
    { scope: "site-b", locale: "zh" },
  ];
}

export default async function Page(props: {
  params: Promise<{ scope: string; locale: string }>;
}) {
  const { scope, locale } = await props.params;
  setRequestLocale(`${locale}|${scope}` as Locale);
  const t = await getTranslations("home");

  return (
    <main>
      server probe: PROBE-v0 ({scope}/{locale}) {t("title")}
      <Poller />
    </main>
  );
}
