import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Next.js repro — issue #94024",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
