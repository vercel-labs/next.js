export default async function P() {
  await new Promise((r) => setTimeout(r, 10));
  throw new Error('throw in page.js');
}
