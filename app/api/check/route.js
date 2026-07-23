import { AccessDeniedException } from "my-sdk";

export const dynamic = "force-dynamic";

export function GET() {
  const error = globalThis.__issue89192Error;

  return Response.json({
    exists: error !== undefined,
    name: error?.name,
    instanceofAccessDeniedException: error instanceof AccessDeniedException,
  });
}
