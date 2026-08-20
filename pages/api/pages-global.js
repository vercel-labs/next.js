import { value } from "../../lib/value";
export default function handler(req, res) {
  console.log("[pages/api/global] global.cachedValue:", global.cachedValue, "module value:", value, "pid:", process.pid);
  res.json({ global: global.cachedValue, value, pid: process.pid });
}
