"use client";
import { varKinds, memberExpr } from "../lib/reserved";
export default function Page() {
  return <pre>{JSON.stringify(varKinds)} {memberExpr}</pre>;
}
