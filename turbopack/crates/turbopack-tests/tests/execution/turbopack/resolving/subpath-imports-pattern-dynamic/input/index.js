const importMessages = (locale) => import(`#/messages/${locale}/index.js`)
const requireMessages = (locale) => require(`#/messages/${locale}/index.js`)

it('should support dynamic requests into the imports field with import()', async () => {
  await expect(importMessages('en')).resolves.toHaveProperty('default', 'en')
  await expect(importMessages('de')).resolves.toHaveProperty('default', 'de')
})

it('should support dynamic requests into the imports field with require()', () => {
  expect(requireMessages('en').default).toBe('en')
  expect(requireMessages('de').default).toBe('de')
})
