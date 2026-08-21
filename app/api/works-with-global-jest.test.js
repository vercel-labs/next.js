/**
 * @jest-environment node
 */
import { GET } from "./hello"
jest.mock('next/headers', () => ({
  headers: jest.fn().mockResolvedValue(new Headers({ "Accept-language": "en-US" }))
}));
it("static import + global jest", async () => {
  const res = await GET();
  expect(await res.json()).toEqual({ language: "en-US" });
});
