import { delay } from "../../lib/delay";
export default async function Page() {
  await delay(3000);
  return <h1>header Page Route</h1>;
}
