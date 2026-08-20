"use server";

import { redirect } from "next/navigation";

export const action = async () => {
  redirect("/");
};
