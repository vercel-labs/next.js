import { delay } from "../lib/delay";
export default async function Home() {
  await delay(3000);
  return <div><h1>Children Page Route</h1><a href="/comments">Hard navigate to /comments</a></div>;
}
