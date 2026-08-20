const base = process.env.BASE_URL || "http://localhost:3000";

const get = async (path) => {
  const res = await fetch(base + path);
  const body = (await res.text()).replace(/<!--.*?-->/g, "");
  const match = body.match(/Current ID: ?(\d+)/);
  console.log(`GET ${path} -> ${res.status}${match ? ` (page shows ID ${match[1]})` : ""}`);
};

await get("/");
await get("/change");
await get("/");
await get("/api/change");
await get("/");
console.log("\nNow inspect the Next.js server log.");
