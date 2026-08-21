import Link from "next/link";

export default async function TestDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-16">
            <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-950/5">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
                    Test Detail
                </p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                    /test/{id}
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                    Intermediate step of the scenario. This page then opens /test/{id}/new in the modal.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                        href={`/test/${id}/new`}
                        className="inline-flex items-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                        Go to /test/{id}/new
                    </Link>
                    <Link
                        href="/test"
                        className="inline-flex items-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                    >
                        Back to /test
                    </Link>
                </div>
            </div>
        </main>
    );
}