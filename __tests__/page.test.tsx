import { render, waitFor } from '@testing-library/react';
import Page, { Child } from '../app/page';

describe('async server components under jest/jsdom', () => {
  it('render(<Page />) directly (issue 47131)', async () => {
    // @ts-expect-error Async Component
    const { container } = await waitFor(() => render(<Page />));
    expect(container.textContent).toContain('Items');
  });

  it('awaiting the component first still fails for async children', async () => {
    const resolved = await Page();
    const { container } = render(resolved);
    expect(container.textContent).toContain('child:a,b');
  });
});
