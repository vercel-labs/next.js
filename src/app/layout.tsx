import React, { Suspense } from "react";

/** Styles */
import type { Metadata } from "next";
import "./globals.css";

/** Components */
import Header from "@/features/shared/ui/Header";
import Loading from "@/features/shared/ui/icon/Loading";

export const metadata: Metadata = {
  title: process.env.APP_TITLE,
  description: process.env.APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="invert-dark-mode">
        <div className="w-100 bkg-circle flex h-screen flex-col">
          <Header />
          <Suspense fallback={<Loading/>}>{children}</Suspense>
        </div>
      </body>
    </html>
  );
}
