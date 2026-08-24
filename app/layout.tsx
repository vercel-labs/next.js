import { PropsWithChildren } from "react";
import { Providers } from "./components/Providers/Providers";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
