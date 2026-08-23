import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { HiringBoard } from "@/components/hiring-board";
import { peoplePrincipalFromHeaders } from "@/lib/people-auth";
import { readConfiguredPeopleState } from "@/lib/people-store";
import { buildCandidateView } from "@/lib/hiring-view";

export default async function HiringPage() {
  const principal = peoplePrincipalFromHeaders(await headers());
  if (!principal) notFound();
  const state = readConfiguredPeopleState();
  return <HiringBoard candidates={buildCandidateView(state.candidates)} />;
}
