import { Counter } from "../../components/Counter";
// Must be dynamic: a static/prerendered route never streams, so it won't reproduce.
export const dynamic = "force-dynamic";
export default async function Slow() {
  await new Promise(r => setTimeout(r, 600)); // suspend so the route streams behind loading.js
  return (<main><h1>slow page</h1><Counter /></main>);
}
