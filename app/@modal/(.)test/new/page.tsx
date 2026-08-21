import Link from "next/link";
import TestModalShell from "../../../test-modal-shell";

export default function TestPageModal() {
    return (
        <TestModalShell
            badge="Test modal"
            title="/test/new"
            description="Minimal modal to reproduce interception from /test."
            closeLabel="Close"
        >
            <Link
                href="/test/42"
                className="inline-flex items-center rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
            >
                Go to /test/[id]
            </Link>
        </TestModalShell>
    );
}