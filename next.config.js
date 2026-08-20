const updateEnvVars = async () => {
  await new Promise((r) => setTimeout(r, 10000))
  process.env.ENV_WITH_CONFIGURE_NEXT = 'true'
  console.log('[next.config] set ENV_WITH_CONFIGURE_NEXT at t+10s')
}
process.env.ENV_WITHOUT_CONFIGURE_NEXT = 'true'
updateEnvVars()
module.exports = {}
