import useTest from '@/hooks/useTest'

it('resolves the root __mocks__ manual mock for the aliased module', () => {
  expect(useTest()).toBe('mocked')
})
