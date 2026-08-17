export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const mod = await import("@libsql/isomorphic-ws");
    console.log("[instrumentation] isomorphic-ws loaded:", typeof mod.default);
  }
}
