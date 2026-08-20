import cache from "../../lib/cache";

export default function handler(req, res) {
  console.log("[pages/api/change] setting id to 2");
  cache.setId("2");
  res.status(200).json({ ok: true });
}
