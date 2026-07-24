import { expect, test } from "@playwright/test";

test("dev Strict Mode removes the pre-hydration sidebar attribute", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("sidebarState", "collapsed"));

  await page.addInitScript(() => {
    const states: Array<string | null> = [];
    Object.defineProperty(window, "__sidebarStates", { value: states });
    const record = () => {
      const value = document.documentElement?.getAttribute("data-sidebar-state") ?? null;
      if (states.at(-1) !== value) states.push(value);
    };
    new MutationObserver(record).observe(document, {
      attributes: true,
      attributeFilter: ["data-sidebar-state"],
      childList: true,
      subtree: true,
    });
  });

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect.poll(() => page.locator("html").getAttribute("data-sidebar-state")).toBeNull();
  await expect(page.locator(".sidebar")).toHaveCSS("width", "272px");

  const observed = await page.evaluate(() => ({
    transitions: (window as Window & { __sidebarStates: Array<string | null> }).__sidebarStates,
    finalAttribute: document.documentElement.getAttribute("data-sidebar-state"),
    savedValue: localStorage.getItem("sidebarState"),
    sidebarWidth: getComputedStyle(document.querySelector(".sidebar")!).width,
  }));

  expect(observed.transitions).toContain("collapsed");
  expect(observed.savedValue).toBe("collapsed");
  console.log("OBSERVED", JSON.stringify(observed));
});
