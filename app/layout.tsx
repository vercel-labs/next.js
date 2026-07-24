import type { ReactNode } from "react";

export const metadata = {
  title: "next App Router — Server Action abort repro",
  description:
    "Prefetch burst exhausts the HTTP/1.1 connection pool and aborts an in-flight Server Action.",
};

// Root layout is intentionally bare: no sidebar here. The 60-link sidebar lives
// in the (dash) layout so that navigating INTO it mounts the links fresh and
// fires the prefetch burst at that moment — right when the action is clicked.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
