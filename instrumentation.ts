export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("pino");
    await import("pino-pretty");
    // @ts-expect-error Missing types
    await import("pino-roll");
  }
}
