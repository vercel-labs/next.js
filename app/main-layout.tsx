import { Suspense, type ReactNode } from "react";
import { Sidebar } from "./sidebar";

export function MainLayout({ children }: { children: ReactNode }) {
	return (
		<div className="app-shell">
			<Sidebar />
			{children}
		</div>
	);
}
