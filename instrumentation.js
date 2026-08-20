// Reproduces vercel/next.js#54417
// A ZodError-like error: subclasses Error but defines `message` as a getter only.
class ZodLikeError extends Error {
  get message() {
    return 'validation failed'
  }
}

throw new ZodLikeError()

export function register() {}
