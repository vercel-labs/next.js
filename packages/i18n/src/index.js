import { locales, defaultLocale } from "@repro/config";
import { t } from "@repro/utils";
export const translate = (k, l = defaultLocale) => `${l}:${t(k)}`;
export { locales };
