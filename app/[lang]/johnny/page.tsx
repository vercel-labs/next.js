import { Locale } from "../../../i18n-config";
import Navigation from "../components/navigation";

export default async function JohnnyPage(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;
  return (
    <div>
      <Navigation />
      <div>
        <p id="locale">Current locale: {lang}</p>
      </div>
    </div>
  );
}
