// Bug 1: next/jest does not apply its SWC transform to Jest `projects`,
// so every test file in a project fails with "Cannot use import statement outside a module".
const nextJest = require("next/jest");
const createJestConfig = nextJest({ dir: "./" });
module.exports = createJestConfig({
  projects: [
    {
      displayName: "jsdom",
      testEnvironment: "jsdom",
      testMatch: ["**/!(*.server).test.[jt]s?(x)", "!**/api/**"],
    },
    {
      displayName: "server",
      testEnvironment: "node",
      testMatch: ["**/api/**/*.test.[jt]s?(x)"],
    },
  ],
});
