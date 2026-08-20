"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = [
  { href: "/a", label: "A" },
  { href: "/b", label: "B" },
];

export default function Navigation() {
  const pathname = usePathname();
  return (
    <nav id="nav" style={{ display: "flex", gap: 24 }}>
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            id={`link-${link.label}`}
            style={{ position: "relative", padding: "8px 24px", textDecoration: "none", color: "#111" }}
          >
            {link.label}
            {active ? (
              <motion.div
                id="highlight"
                layoutId="highlight"
                transition={{ type: "tween", duration: 1.5, ease: "linear" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#3b82f6",
                  borderRadius: 8,
                  zIndex: -1,
                }}
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
