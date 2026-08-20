import { buttonGreenClassName } from "@/features/shared/ui/control/button/buttonClassName";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mt-8 flex flex-1 flex-col">
      <div className="flex flex-col items-center">
        <Link href="/dashboard" className="-m-1.5 p-1.5">
          <span className="sr-only">app-project</span>
        </Link>
        <div className="mt-8 flex flex-col items-center">
          <h2 className="text-3xl">404</h2>
          <p className="mt-4">This page could not be found.</p>
          <Link href="/dashboard" className={`${buttonGreenClassName} mt-8`}>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
