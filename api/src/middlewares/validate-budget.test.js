import { describe, expect, it, vi } from "vitest";
import { validateUpdateBudgets } from "./validate-budget.js";

const runMiddleware = (body) => {
  const req = { body };
  const next = vi.fn();

  validateUpdateBudgets(req, {}, next);

  return { next, req };
};

describe("validateUpdateBudgets middleware", () => {
  it("normalizes a valid budget payload", () => {
    const { next, req } = runMiddleware({
      budgets: [
        { amount: "5000", category: "food" },
        { amount: 0, category: "transport" },
      ],
    });

    expect(req.body.budgets).toEqual([
      { amount: 5000, category: "food" },
      { amount: 0, category: "transport" },
    ]);
    expect(next).toHaveBeenCalledWith();
  });

  it("rejects non-array budgets", () => {
    const { next } = runMiddleware({ budgets: {} });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Budget validation failed",
        details: {
          budgets: "Budgets must be an array",
        },
      })
    );
  });

  it("rejects invalid categories, duplicate categories, and negative amounts", () => {
    const { next } = runMiddleware({
      budgets: [
        { amount: -1, category: "food" },
        { amount: 100, category: "food" },
        { amount: 100, category: "invalid" },
      ],
    });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        details: {
          "budgets.0.amount": "Budget amount must be zero or greater",
          "budgets.1.category": "Budget category cannot be duplicated",
          "budgets.2.category": "Budget category is invalid",
        },
      })
    );
  });
});
