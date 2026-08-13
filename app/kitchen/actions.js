'use server';
export async function submit(formData) {
  return { ok: true, at: Date.now(), n: formData ? 1 : 0 };
}
