"use client";
import { table } from "@/lib/tbrepro/table.js";
export default function TbRepro() {
  return <pre id="out">{JSON.stringify(table)}</pre>;
}
