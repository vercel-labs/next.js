import { AccessDeniedException } from "my-sdk";

export async function GET() {
  const error = new AccessDeniedException({ message: "Test error" });
  (globalThis as any).__next89192Error = error;
  return Response.json({
    stored: true,
    isAccessDenied: error instanceof AccessDeniedException,
    errorName: error.name,
    errorConstructorName: error.constructor.name,
    classIdentity: AccessDeniedException.toString().slice(0, 100),
  });
}
