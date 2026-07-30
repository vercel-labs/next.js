import { getSharedSettings } from "./lib/cache";

export default async function Home() {
  const settings = await getSharedSettings();
  return (
    <main>
      <h1>home</h1>
      <p data-testid="shared">{settings.title}</p>
    </main>
  );
}
