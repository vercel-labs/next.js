import { redirect } from "next/navigation";

// Original repro from the issue: server component redirects to a Route Handler.
// On next@14.2.3 this called the handler twice (once with ?_rsc=). Fixed on 15/16.
export default function Home() {
  redirect("/api/redirect");
}
