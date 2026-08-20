"use client";

import { ClerkProvider, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex min-h-14 w-full items-center justify-between pr-8">
      <button type="button" className="flex h-full items-center px-2">
        <div className="flex h-full w-48 items-center justify-center">
          <Image
            src="/vercel.svg"
            width={150}
            height={80}
            alt="Logo"
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
          />
        </div>
      </button>
      <ClerkProvider>
        <UserButton />
      </ClerkProvider>
    </header>
  );
}
