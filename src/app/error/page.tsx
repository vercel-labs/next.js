import { Pathname } from "@/components/Pathname";
import { Suspense } from "react";

export default async function Page({}) {
	return <div><Suspense><Pathname /></Suspense></div>
}