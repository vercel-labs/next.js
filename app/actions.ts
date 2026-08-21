'use server'

export async function protectedAction() {
  console.log('[server action] protectedAction RAN')
  return 'action-ran'
}
