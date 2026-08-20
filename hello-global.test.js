// Control: same test using the global `jest` (no @jest/globals import) — passes
import hello from './hello';

jest.mock('./greet', () => (name) => 'Hola ' + name);

it('applies a mock with global jest', () => {
  expect(hello('Jane')).toBe('Hola Jane');
});
