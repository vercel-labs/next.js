export type PeopleState = { candidates: { id: string; name: string; stage: string }[] };

export function readConfiguredPeopleState(): PeopleState {
  return { candidates: [{ id: "c1", name: "Ada", stage: "onsite" }] };
}
