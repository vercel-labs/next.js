import { AccessDeniedException } from "my-sdk";

export async function GET() {
  const error = (globalThis as any).__next89192Error;
  return Response.json({
    found: error !== undefined,
    isAccessDenied: error instanceof AccessDeniedException,
    sameConstructor: error?.constructor === AccessDeniedException,
    classIdentity: AccessDeniedException.toString().slice(0, 100),
  });
}
