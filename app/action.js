"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function submitForm() {
  revalidatePath("/")
  return "action ran"
}
export async function doRedirect() { redirect("/test") }
