export function middleware() {
  console.log('MW ENV_WITH_INSTRUMENTATION:', process.env.ENV_WITH_INSTRUMENTATION)
  console.log('MW ENV_WITHOUT_CONFIGURE_NEXT:', process.env.ENV_WITHOUT_CONFIGURE_NEXT)
  console.log('MW ENV_WITH_CONFIGURE_NEXT:', process.env.ENV_WITH_CONFIGURE_NEXT)
}
export const config = { matcher: '/' }
