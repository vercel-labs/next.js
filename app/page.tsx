import { redirect } from "next/navigation";

// App Router control-flow throw at the end of a server render.
export default async function Home() {
  redirect("/dashboard");
}
