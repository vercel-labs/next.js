import {jest} from '@jest/globals';
import hello from './hello';

jest.mock('./greet', () => (name) => 'Hola ' + name);

it('applies a mock', () => {
  expect(hello('Jane')).toBe('Hola Jane');
});
