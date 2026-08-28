'use server'

export async function updateUser(userId, previousState, formData) {
  return `Updated ${userId} to ${formData.get('name')}`
}
