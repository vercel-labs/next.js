import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import Counter from "./components/counter";
import LocaleSwitcher from "./components/locale-switcher";
import Navigation from "./components/navigation";

export default async function IndexPage(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;

  const dictionary = await getDictionary(lang);

  return (
    <div>
      <Navigation />
      <LocaleSwitcher />
      <div>
        <p id="locale">Current locale: {lang}</p>
        <p>
          This text is rendered on the server:{" "}
          {dictionary["server-component"].welcome}
        </p>
        <Counter dictionary={dictionary.counter} />
      </div>
    </div>
  );
}
