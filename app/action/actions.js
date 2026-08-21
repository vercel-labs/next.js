'use server'

export async function receive(payload) {
  return { receivedLength: typeof payload === 'string' ? payload.length : -1 }
}
