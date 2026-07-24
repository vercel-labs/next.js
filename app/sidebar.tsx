"use client";

export function Sidebar() {
	const chats = [
		{ id: "1", title: "Hydration investigation" },
		{ id: "2", title: "Cache Components" },
	];
	function toggle() {
		const root = document.documentElement;
		const next = root.dataset.sidebarState === "collapsed" ? "expanded" : "collapsed";
		root.dataset.sidebarState = next;
		localStorage.setItem("sidebarState", next);
	}

	return (
		<aside className="sidebar">
			<div className="sidebar-header">
				<strong>RC</strong>
				<span>Realtime Chat</span>
				<button onClick={toggle} aria-label="Toggle sidebar">
					◧
				</button>
			</div>
			<div className="sidebar-details">
				<p>Your chats</p>
				{chats.map((chat) => (
					<div className="chat" key={chat.id}>
						{chat.title}
					</div>
				))}
			</div>
		</aside>
	);
}
