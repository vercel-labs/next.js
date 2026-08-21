export const register = async () => {
  const { registerInstrumentations } = await import('@opentelemetry/instrumentation')
  registerInstrumentations({ instrumentations: [] })
}
