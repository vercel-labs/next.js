import { ClientComponent, i18nTokens } from "./client-array";

const translations: Array<[string, string]> = [["foo", "translation for foo"], ["bar", "translation for bar"]]
/** Add your relevant code here for the issue to reproduce */
export default function Home() {
  const clientTranslations = translations.filter(([key, value]) => i18nTokens.includes(key))
  return <ClientComponent translations={clientTranslations} />;
}
