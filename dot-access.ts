// Dot access is required for Next.js to inline the value into the client bundle,
// but `noPropertyAccessFromIndexSignature: true` rejects it with TS4111.
export const dotAccess = process.env.NEXT_PUBLIC_FOO
