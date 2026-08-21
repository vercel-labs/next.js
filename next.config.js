/** @type {import('next').NextConfig} */
export default {
  // Forces the project package.json (which has "type": "module") into the
  // deployed Node function, the same way file tracing does in a pnpm monorepo.
  outputFileTracingIncludes: {
    '/': ['./package.json'],
  },
}
