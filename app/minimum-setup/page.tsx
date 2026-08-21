import { redirect } from "next/navigation";
export default function MinimumSetup() {
  console.log("MinimumSetup");
  redirect("/minimum-setup/result");
}
