"use client";
import { motion } from "framer-motion";

export function Card({ big, id }: { big: boolean; id: string }) {
  return (
    <motion.div
      id={id}
      layoutId="card"
      transition={{ type: "tween", duration: 1.5, ease: "linear" }}
      style={{
        background: "#3b82f6",
        borderRadius: 12,
        width: big ? 400 : 100,
        height: big ? 300 : 100,
      }}
    />
  );
}
