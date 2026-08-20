// Default jest environment is jsdom (see jest.config.js), as in most Next.js app test setups
import { submit } from './actions';

test('submit works', () => {
  expect(submit()).toBe('ok');
});
