import { getRequestConfig } from "next-intl/server";

// 复合 requestLocale：`${locale}|${scope}`（镜像多租户方案），不读 headers/cookies
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = (await requestLocale) ?? "en|site-a";
  const [locale] = requested.split("|");

  return {
    locale: locale || "en",
    messages: (await import(`../messages/en.json`)).default,
  };
});
