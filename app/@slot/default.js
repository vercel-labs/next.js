export default async function SlotDefault() {
  await new Promise((r) => setTimeout(r, 10));
  throw new Error('throw in @slot/default');
}
