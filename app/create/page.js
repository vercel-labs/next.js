import { AccessDeniedException } from "my-sdk";

export const dynamic = "force-dynamic";

export default function CreatePage() {
  const error = new AccessDeniedException("created by the SSR runtime");
  globalThis.__issue89192Error = error;

  return <pre>{JSON.stringify({ localInstanceof: error instanceof AccessDeniedException })}</pre>;
}
