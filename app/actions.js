'use server'
export async function submitContactForm(recipients, prevState, formData) {
  return { ok: true, recipients, message: formData.get('message') }
}
