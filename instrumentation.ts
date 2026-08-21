export const register = async () => {
  console.log('registering instrumentation', process.env.NEXT_RUNTIME)
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason)
  })
}
