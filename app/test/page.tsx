import Link from "next/link";

export default function TestPage () {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-16">
            <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-950/5">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
                    Test Flow
                </p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                    /test
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                    Entry point of the reproduction scenario. Opens the /test/new route to verify interception in the modal slot.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                        href="/test/new"
                        className="inline-flex items-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                        Go to /test/new
                    </Link>
                </div>
            </div>
        </main>
    );
}