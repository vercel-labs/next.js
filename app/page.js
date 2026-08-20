import { value } from "../lib/value";
export const dynamic = "force-dynamic";
export default function Page() {
  console.log("[app/page] global.cachedValue:", global.cachedValue, "module value:", value, "pid:", process.pid);
  return <p id="v">app-page:{value}</p>;
}
// edit 1
// edit 2
// edit 3
// w1
// w2
// w3
