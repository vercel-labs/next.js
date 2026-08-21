import { Toggle } from "@/toggle";

export const dynamic = "force-dynamic"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toggle/>
        </body>
    </html>
  );
}
