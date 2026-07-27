import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({
    serviceName: "otel-hmr-repro",
    instrumentationConfig: {
      fetch: {
        propagateContextUrls: [/localhost/],
      },
    },
  });
}
