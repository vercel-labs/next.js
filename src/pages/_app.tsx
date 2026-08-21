import type { AppProps } from "next/app";
import { useRouter } from "next/router";

export default function Root({ Component, pageProps }: AppProps) {
  const router = useRouter();
  console.log(router.route, pageProps);
  return <Component {...pageProps} />;
}
