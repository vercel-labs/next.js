// Simulates a ZodError-like error whose `message` is a getter-only property.
class GetterOnlyError extends Error {
  constructor(private readonly detail: string) {
    super()
  }
  get message() {
    return `REAL ERROR: ${this.detail}`
  }
}

throw new GetterOnlyError('invalid environment variable FOO')

export function register() {}
