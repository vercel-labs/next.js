import { AccessDeniedException } from "my-sdk";

type ReproductionGlobal = typeof globalThis & {
  __issue89192Error?: Error;
};

export async function GET() {
  const error = new AccessDeniedException({ message: "created by /api/test" });
  (globalThis as ReproductionGlobal).__issue89192Error = error;

  return Response.json({
    stored: true,
    localInstanceof: error instanceof AccessDeniedException,
    errorName: error.name,
    constructorName: error.constructor.name,
    classIdentity: AccessDeniedException.toString().slice(0, 100),
  });
}
