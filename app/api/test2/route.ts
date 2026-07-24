import { AccessDeniedException } from "my-sdk";

type ReproductionGlobal = typeof globalThis & {
  __issue89192Error?: Error;
};

export async function GET() {
  const error = (globalThis as ReproductionGlobal).__issue89192Error;
  const localError = new AccessDeniedException({ message: "created by /api/test2" });

  return Response.json({
    foundStoredError: Boolean(error),
    isAccessDenied: error instanceof AccessDeniedException,
    constructorMatches: error?.constructor === AccessDeniedException,
    localInstanceof: localError instanceof AccessDeniedException,
    classIdentity: AccessDeniedException.toString().slice(0, 100),
  });
}
