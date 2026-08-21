import { use } from "react";

// Mimics a data layer that rejects with a plain object instead of an Error
// (e.g. a driver/library rejecting `{}`), like devlinks' getCurrentSession().
async function getCurrentSession() {
  await new Promise((r) => setTimeout(r, 10));
  throw {};
}

export default function PreviewButton() {
  const { user } = use(getCurrentSession());
  return <a href={`/${user.id}`}>Preview</a>;
}
