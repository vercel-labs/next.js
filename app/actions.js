'use server'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function toggleDraftMode() {
  const dm = await draftMode()
  if (dm.isEnabled) {
    dm.disable()
  } else {
    dm.enable()
  }
  redirect('/')
}
