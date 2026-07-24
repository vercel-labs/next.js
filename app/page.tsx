import Link from "next/link";
import { MainLayout } from "./main-layout";

export default function Home() {
	return (
		<MainLayout>
			<main className="main-content">
				<p className="eyebrow">Next preview · Cache Components</p>
				<h1>Root state before async data</h1>
				<p className="lede">
					The sidebar waits 1.2 seconds for server data. Its empty Suspense fallback must not decide
					whether the layout is expanded or collapsed.
				</p>
				<div className="actions">
					<Link href="/secondary">Open prefetched route</Link>
					<button id="reset-state" type="button">
						Reset saved state
					</button>
				</div>
				<section className="readout">
					<p className="status" id="status">
						Waiting for client hydration…
					</p>
					<dl>
						<div>
							<dt>Root attribute</dt>
							<dd id="root-state">—</dd>
						</div>
						<div>
							<dt>Saved value</dt>
							<dd id="stored-state">—</dd>
						</div>
						<div>
							<dt>Sidebar data</dt>
							<dd id="async-state">Streaming…</dd>
						</div>
					</dl>
				</section>
			</main>
		</MainLayout>
	);
}
