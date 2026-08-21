// Bug 1 symptom: without `@jest-environment node`, importing next/server in jsdom
// fails with "ReferenceError: Request is not defined".
import { GET } from "./hello";

it("cannot even load the route handler under jsdom", async () => {
  expect(typeof GET).toBe("function");
});
