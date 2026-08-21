import Link from "next/link";
import TestModalShell from "../../../../test-modal-shell";
import { updateTag } from "next/cache";

export default async function TestPageModal({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const serverAction = async () => {
        "use server";
        updateTag("test");
    };

    return (
        <TestModalShell
            badge={`Test #${id}`}
            title={`/test/${id}/new`}
            description="Minimal modal to reproduce the updateTag flow."
            closeLabel="Back"
        >
            <button onClick={serverAction}>Update Tag</button>
        </TestModalShell>
    );
}