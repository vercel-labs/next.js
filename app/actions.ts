'use server'

export async function login(): Promise<{ message: string }> {
  // simulates a failed auth lookup inside a server action
  throw new Error('Invalid email or password')
}
