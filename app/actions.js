'use server'
import { redirect } from 'next/navigation'

export async function triggerRedirect() {
  redirect('/target?hello=xyz')
}
