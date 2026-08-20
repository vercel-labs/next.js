test('importing next/server in a jsdom test environment', () => {
  const { NextResponse } = require('next/server');
  expect(NextResponse).toBeTruthy();
});
