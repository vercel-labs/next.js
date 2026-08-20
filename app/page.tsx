import { thirdPartyUuid } from "../lib/third-party-sdk";

// Mimics a third-party SDK (e.g. @sentry/core uuid4()) generating an ID in a
// Server Component without first reading Request data.
export default async function Page() {
  const id = thirdPartyUuid();
  return <p>trace id: {id}</p>;
}
