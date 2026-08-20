"use server";

import { redirect } from "next/navigation";

export async function redirectPrivate() {
  redirect("/private");
}

export async function redirectPrivateSuspense() {
  redirect("/private-suspense");
}
