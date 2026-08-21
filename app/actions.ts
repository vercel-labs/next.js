'use server'

export async function createBoardAction(formData: FormData) {
  const title = String(formData.get('title') ?? '')
  await new Promise((r) => setTimeout(r, 300))
  return { slug: title.toLowerCase().replace(/\s+/g, '-') || 'default' }
}
