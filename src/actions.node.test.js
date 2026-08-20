/**
 * Control case: the same import succeeds in the node test environment.
 * @jest-environment node
 */
test('next/cache imports fine in node environment', () => {
  const { revalidatePath } = require('next/cache');
  expect(typeof revalidatePath).toBe('function');
});
