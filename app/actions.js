"use server";

export async function unboundAction(prevState, formData) {
  console.log("ACTION RAN: unbound", formData.get("hello"));
  return { ok: true };
}

export async function boundAction(id, prevState, formData) {
  console.log("ACTION RAN: bound", id, formData.get("hello"));
  return { ok: true };
}
