/**
 * @jest-environment node
 */
import { expect, it, jest } from "@jest/globals";
import { GET } from "./hello"

// Doesn't seem to work
// @see https://github.com/vercel/next.js/discussions/59041
jest.mock('next/headers', () => ({
    headers: jest.fn().mockResolvedValue(new Headers({ "Accept-language": "en-US,en;q=0.9" }))
}));

it("returns accept-language header", async () => {
    const response = await GET()
    expect(response).toEqual({ language: "en-US,en;q=0.9" })
})