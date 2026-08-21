import { track } from './actions';

export default async function Home() {
  const n = await track('static /');
  return <p>static route, requests={n}</p>;
}
