'use server';
export async function doAction() {
  console.log('[server action] executed');
  return { ok: true, ranAt: Date.now() };
}
