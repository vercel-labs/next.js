import { getSharedSettings } from "../lib/cache";

export default async function PageA() {
  const settings = await getSharedSettings();
  return (
    <main>
      <h1>a</h1>
      <p data-testid="shared">{settings.title}</p>
    </main>
  );
}
