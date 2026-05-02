import { test, expect } from "bun:test";
import { applyDiscount } from "./discount";

test("applies 10% discount for totals over 100", () => {
  const result = applyDiscount(120);
  expect(result).toBe(108); // 120 - 12
});

test(`doesn't apply discount for totals 100 or less`, () => {
  const result = applyDiscount(50);
  expect(result).toBe(50);
});
