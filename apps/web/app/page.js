import { label, Icon, cx } from "@repro/ui";
import { locales } from "@repro/i18n";
export default function Page() {
  return <main className={cx("home")}>{label("hello")} {locales.join(",")} <Icon name="x" /></main>;
}
