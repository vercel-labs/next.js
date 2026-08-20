import { delay } from "../lib/delay";
export default async function Default() {
  await delay(3000);
  return <h1>Children Default Route</h1>;
}
