export async function register() {
  const { Hook } = await import('require-in-the-middle');
  new Hook(['fs'], (exports) => exports);
  console.log('instrumentation registered');
}
