import { Poppins, Inter } from "next/font/google";
const poppinsNoVar = Poppins({ subsets: ["latin"], weight: ["100","200","300","400","500"] });
const poppinsVar = Poppins({ subsets: ["latin"], weight: ["400"], variable: "--font-poppins" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export default function P() {
  const data = { poppinsNoVar, poppinsVar, inter };
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
