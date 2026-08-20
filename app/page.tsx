// Simulates a third-party SDK (appwrite / @twilio/conversations) that pulls in
// `isomorphic-form-data`, which overwrites the global FormData with the
// node `form-data` implementation.
import "isomorphic-form-data";
import RunServerAction from "./run-server-action";

export default async function Page() {
  return <RunServerAction />;
}
