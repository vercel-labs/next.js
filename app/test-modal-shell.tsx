"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";

type TestModalShellProps = {
  badge: string;
  title: string;
  description: string;
  closeLabel: string;
  children?: ReactNode;
};

export default function TestModalShell({
  badge,
  title,
  description,
  closeLabel,
  children,
}: TestModalShellProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-8">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-lg">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
            {badge}
          </p>
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        </div>

        <div className="mt-4 space-y-4 text-slate-700">
          <p className="text-sm leading-5 text-slate-600">{description}</p>

          {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              {closeLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}