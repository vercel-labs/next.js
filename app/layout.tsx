import { headers } from "next/headers";
import { peoplePrincipalFromHeaders } from "@/lib/people-auth";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const principal = peoplePrincipalFromHeaders(await headers());
  return (
    <html lang="en">
      <body>
        <div id="principal">{principal?.email ?? "anonymous"}</div>
        {children}
      </body>
    </html>
  );
}
