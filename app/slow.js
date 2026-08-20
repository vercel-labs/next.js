import { sleep } from "./sleep";
export default async function Slow({ label }) {
  await sleep(3000);
  return <div id="slow-data">SLOW DATA LOADED: {label}</div>;
}
