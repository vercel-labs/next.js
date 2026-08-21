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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/25">
        <div className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-6 py-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-85">
            {badge}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h2>
        </div>

        <div className="space-y-5 px-6 py-6 text-slate-700">
          <p className="text-sm leading-6">{description}</p>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-rose-500" />
            </div>
            <div className="mt-4 space-y-3">
              <div className="h-3 w-3/4 rounded-full bg-slate-200" />
              <div className="h-3 w-full rounded-full bg-slate-200" />
              <div className="h-3 w-2/3 rounded-full bg-slate-200" />
            </div>
          </div>

          {children ? <div className="flex flex-wrap gap-3">{children}</div> : null}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              {closeLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}