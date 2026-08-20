import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500"],
});

export const metadata = { title: "Poppins repro" };

export default function RootLayout({ children }) {
  console.log("POPPINS OBJECT:", JSON.stringify(poppins));
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
