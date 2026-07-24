import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const sidebarInitScript = `try { const value = localStorage.getItem("sidebarState"); document.documentElement.dataset.sidebarState = value === "collapsed" ? "collapsed" : "expanded"; } catch (_) {}`;

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Sidebar hydration reproduction",
	description: "sidebar state reproduction for Next preview",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable}`}
			suppressHydrationWarning
		>
			<head>
				<script dangerouslySetInnerHTML={{ __html: sidebarInitScript }} />
			</head>
			<body>{children}</body>
		</html>
	);
}
