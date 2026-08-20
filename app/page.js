export const dynamic = 'force-dynamic';

class CustomError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.name = 'CustomError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export default async function Page() {
  const err = new CustomError('boom from server component', 403, 'FORBIDDEN');
  console.log('[server] thrown error props:', {
    message: err.message,
    name: err.name,
    statusCode: err.statusCode,
    code: err.code,
  });
  throw err;
}
