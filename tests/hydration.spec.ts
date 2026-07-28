import { expect, test } from "@playwright/test";

test("the App Router document hydrates in development", async ({ page }) => {
  await page.addInitScript(() => {
    const renderers = new Map();
    let nextRendererId = 0;

    Object.defineProperty(window, "__REACT_DEVTOOLS_GLOBAL_HOOK__", {
      value: {
        supportsFiber: true,
        renderers,
        inject(renderer: unknown) {
          const id = ++nextRendererId;
          renderers.set(id, renderer);
          return id;
        },
        onCommitFiberRoot() {},
        onCommitFiberUnmount() {},
        onPostCommitFiberRoot() {},
      },
    });
  });

  const response = await page.goto("/");
  expect(response?.status()).toBe(200);

  const counter = page.locator("main button");
  await expect(counter).toHaveText("Count: 0");
  await counter.click();
  await expect(counter).toHaveText("Count: 1");

  const evidence = await page.evaluate(() => {
    const hook = (
      window as typeof window & {
        __REACT_DEVTOOLS_GLOBAL_HOOK__: { renderers: Map<number, unknown> };
      }
    ).__REACT_DEVTOOLS_GLOBAL_HOOK__;

    return {
      rendererCount: hook.renderers.size,
      reactRootElements: [...document.querySelectorAll("*")].filter((element) =>
        Object.keys(element).some((key) => key.startsWith("__reactContainer")),
      ).length,
      buttonText: document.querySelector("main button")?.textContent,
    };
  });

  console.log("HYDRATION_EVIDENCE", JSON.stringify(evidence));
  expect(evidence.rendererCount).toBeGreaterThan(0);
  expect(evidence.reactRootElements).toBeGreaterThan(0);
});
