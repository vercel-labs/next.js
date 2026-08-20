import localFont from "next/font/local";
import { Oxanium } from "next/font/google";

export const oxaniumLocal = localFont({ src: "./oxanium.ttf", display: "swap" });
export const oxanium = Oxanium({ subsets: ["latin"] });
